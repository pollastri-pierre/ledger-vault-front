// @flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import { StatusCodes } from "@ledgerhq/hw-transport";
import network, { NetworkError } from "network";
import { connect } from "react-redux";
import type { Translate, Organization, GateError } from "data/types";
import type { DeviceError } from "utils/errors";
import HelpLink from "components/HelpLink";
import { UnknownDomain, GenericError, InvalidDataDevice } from "utils/errors";
import type { MemoryHistory } from "history";
import { withRouter, Redirect } from "react-router";
import { FaUser } from "react-icons/fa";
import Alert from "components/utils/Alert";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalFooterButton,
} from "components/base/Modal";
import Card from "components/base/Card";
import CenteredLayout from "components/base/CenteredLayout";
import TranslatedError from "components/TranslatedError";
import Logo from "components/Logo";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { loginFlow } from "device/interactions/loginFlow";
import type { LoginFlowResponse } from "device/interactions/loginFlow";

import { addMessage, addError } from "redux/modules/alerts";
import DeviceInteraction from "components/DeviceInteraction";
import InputField from "components/InputField";
import { login } from "redux/modules/auth";

import colors from "shared/colors";

const mapDispatchToProps = {
  login,
  addMessage,
  addError,
};

const styles = {
  banner: {
    width: 520,
  },
  help: {
    cursor: "pointer",
    opacity: "0.5",
    textDecoration: "none",
    transition: "opacity 0.2s ease",
  },
};

const unknownDomainError = new UnknownDomain();

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
    domain: process.env.NODE_ENV === "e2e" ? "ledger1" : "",
    organization: null,
    error: false,
    errorDomain: false,
    onboardingToBeDone: false,
    isChecking: false,
  };

  onFinishLogin = (responses: LoginFlowResponse) => {
    this.props.login(responses.u2f_challenge.token);
    this.props.history.push(`/${responses.organization.workspace}`);
    this.props.addMessage("Hello", "Welcome to the Ledger Vault platform!");
  };

  onError = (e: Error | DeviceError | GateError) => {
    this.setState({ error: true });
    // we don't want an error message if it's device reject
    if (e instanceof NetworkError && e.json) {
      this.props.addMessage(`Error ${e.json.code}`, e.json.message, "error");
    } else if (e.statusCode && e.statusCode === StatusCodes.INCORRECT_DATA) {
      this.props.addError(new InvalidDataDevice());
    } else if (e.statusCode !== StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED) {
      this.props.addError(new GenericError());
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

  onChange = (domain: string) => {
    this.setState({ domain });
  };

  onClose = () => {
    this.setState({ errorDomain: false });
  };

  onKeyPress = (e: SyntheticKeyboardEvent<Document>) => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  render() {
    const {
      domain,
      error,
      errorDomain,
      isChecking,
      onboardingToBeDone,
    } = this.state;
    const { t } = this.props;

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
        <Box
          horizontal
          justify="space-between"
          align="center"
          mb={10}
          style={styles.banner}
        >
          <Logo />
          <HelpLink
            style={styles.help}
            subLink="/Content/transactions/signin.htm"
          >
            <Text small uppercase i18nKey="welcome:help" />
          </HelpLink>
        </Box>
        <Card overflow="visible">
          <ModalBody>
            <ModalHeader>
              <Box align="center" flow={20}>
                <FaUser color={colors.lead} size={32} />
                <InputField
                  value={domain}
                  disabled={isChecking}
                  autoFocus
                  autoComplete="off"
                  error={error ? domain !== "" : false}
                  InputProps={{
                    inputProps: {
                      style: {
                        textAlign: "center",
                        paddingBottom: 20,
                      },
                    },
                  }}
                  onKeyPress={this.onKeyPress}
                  onChange={this.onChange}
                  placeholder={t("welcome:placeholder_domain")}
                />
                <Text i18nKey="welcome:domain_description" />
              </Box>
            </ModalHeader>
          </ModalBody>
          <ModalFooter>
            {this.state.organization && !this.state.error ? (
              <Box mb={20}>
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
            )}
          </ModalFooter>
        </Card>
        <Box align="center" mt={40}>
          <Text small>Vault - v0.2</Text>
        </Box>
      </CenteredLayout>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(translate()(Welcome)));
