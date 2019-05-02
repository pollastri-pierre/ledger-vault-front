// @flow

import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { StatusCodes } from "@ledgerhq/hw-transport";
import { FaUser } from "react-icons/fa";
import type { MemoryHistory } from "history";

import { UnknownDomain, GenericError, InvalidDataDevice } from "utils/errors";
import colors from "shared/colors";
import network, { NetworkError } from "network";
import type { DeviceError } from "utils/errors";

import { addMessage, addError } from "redux/modules/alerts";
import { login } from "redux/modules/auth";
import { loginFlow } from "device/interactions/loginFlow";
import type { LoginFlowResponse } from "device/interactions/loginFlow";
import type { Translate, Organization, GateError } from "data/types";

import CenteredLayout from "components/base/CenteredLayout";
import DeviceInteraction from "components/DeviceInteraction";
import TranslatedError from "components/TranslatedError";
import { ModalFooterButton } from "components/base/Modal";
import Absolute from "components/base/Absolute";
import InputField from "components/InputField";
import HelpLink from "components/HelpLink";
import Alert from "components/utils/Alert";
import Logo from "components/icons/Logo";
import Text from "components/base/Text";
import Card from "components/base/Card";
import Box from "components/base/Box";

const unknownDomainError = new UnknownDomain();
const mapDispatchToProps = { login, addMessage, addError };

type Props = {
  login: string => void,
  addMessage: (string, string, ?string) => void,
  addError: Error => void,
  history: MemoryHistory,
  t: Translate,
};

type State = {
  domain: string,
  error: boolean,
  errorDomain: boolean,
  organization: ?Organization,
  isChecking: boolean,
  onboardingToBeDone: boolean,
};

class Welcome extends Component<Props, State> {
  state = {
    domain: process.env.ORGANIZATION_NAME || "",
    organization: null,
    error: false,
    errorDomain: false,
    onboardingToBeDone: false,
    isChecking: false,
  };

  onFinishLogin = (responses: LoginFlowResponse) => {
    const { login, history, addMessage } = this.props;
    login(responses.u2f_challenge.token);
    history.push(`/${responses.organization.workspace}`);
    addMessage("Hello", "Welcome to the Ledger Vault platform!");
  };

  onError = (e: Error | DeviceError | GateError) => {
    const { addMessage, addError } = this.props;
    this.setState({ error: true });
    // we don't want an error message if it's device reject
    if (e instanceof NetworkError && e.json) {
      addMessage(`Error ${e.json.code}`, e.json.message, "error");
    } else if (e.statusCode && e.statusCode === StatusCodes.INCORRECT_DATA) {
      addError(new InvalidDataDevice());
    } else if (e.statusCode !== StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED) {
      addError(new GenericError());
    }
  };

  onSubmit = async () => {
    const { domain, isChecking } = this.state;
    if (!domain || isChecking) return;

    this.setState({ error: false, errorDomain: false, isChecking: true });
    try {
      const url = `${domain}/organization`;
      const { state } = await network(`${domain}/onboarding/state`, "GET");
      if (state !== "COMPLETE") {
        this.setState({ onboardingToBeDone: true });
        return;
      }
      const organization = await network(url, "GET");
      this.setState({ isChecking: false, organization });
    } catch (e) {
      console.error(e);
      this.setState({ errorDomain: true, isChecking: false });
    }
  };

  onChange = (domain: string) => this.setState({ domain });

  onClose = () => this.setState({ errorDomain: false });

  onKeyPress = (e: SyntheticKeyboardEvent<Document>) => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  render() {
    const { t } = this.props;
    const {
      domain,
      error,
      errorDomain,
      isChecking,
      onboardingToBeDone,
    } = this.state;

    const footer =
      this.state.organization && !this.state.error ? (
        <Box mb={15}>
          <DeviceInteraction
            onSuccess={this.onFinishLogin}
            interactions={loginFlow}
            onError={this.onError}
            additionalFields={{
              organization: this.state.organization,
            }}
          />
        </Box>
      ) : (
        <ModalFooterButton
          data-test="continue_button"
          color={colors.ocean}
          onClick={this.onSubmit}
          isDisabled={!domain || isChecking}
        >
          <Text i18nKey="common:continue" />
        </ModalFooterButton>
      );

    return (
      <CenteredLayout>
        {onboardingToBeDone && <Redirect to={`${domain}/onboarding`} />}
        <Alert
          onClose={this.onClose}
          open={errorDomain}
          autoHideDuration={4000}
          title="Error"
          theme="error"
        >
          <TranslatedError error={unknownDomainError} field="description" />
        </Alert>
        <LogoRow />
        <Card
          overflow="visible"
          width={540}
          height={350}
          flow={20}
          px={60}
          pt={80}
          position="relative"
          align="center"
        >
          <FaUser color={colors.lightGrey} size={32} />
          <InputField
            value={domain}
            disabled={isChecking}
            autoFocus
            autoComplete="off"
            error={error ? domain !== "" : false}
            InputProps={inputProps}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
            placeholder={t("welcome:placeholder_domain")}
          />
          <Text i18nKey="welcome:domain_description" />
          <Absolute right={15} bottom={0}>
            {footer}
          </Absolute>
        </Card>
        <Box align="center" mt={40}>
          <Text small>Vault - v{VAULT_FRONT_VERSION}</Text>
        </Box>
      </CenteredLayout>
    );
  }
}

const LogoRow = () => (
  <Box horizontal justify="space-between" align="center" mb={10} width={520}>
    <Logo width={100} />
    <HelpLink style={styles.help} subLink="/Content/transactions/signin.htm">
      <Text small uppercase i18nKey="welcome:help" />
    </HelpLink>
  </Box>
);

const styles = {
  help: {
    cursor: "pointer",
    opacity: "0.5",
    textDecoration: "none",
    transition: "opacity 0.2s ease",
  },
};

const inputProps = {
  inputProps: {
    style: {
      textAlign: "center",
      paddingBottom: 20,
    },
  },
};

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(translate()(Welcome)));
