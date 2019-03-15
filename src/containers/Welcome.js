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
import { withStyles } from "@material-ui/core/styles";
import { withRouter, Redirect } from "react-router";
import DialogButton from "components/buttons/DialogButton";
import Alert from "components/utils/Alert";
import TranslatedError from "components/TranslatedError";
import Logo from "components/Logo";
import { loginFlow } from "device/interactions/loginFlow";
import type { LoginFlowResponse } from "device/interactions/loginFlow";

import Profile from "components/icons/thin/Profile";
import MUITextField from "@material-ui/core/TextField";
import { addMessage, addError } from "redux/modules/alerts";
import DeviceInteraction from "components/DeviceInteraction";
import { login } from "redux/modules/auth";

const mapDispatchToProps = {
  login,
  addMessage,
  addError,
};

const styles = {
  base: {
    position: "relative",
    textAlign: "center",
    height: 258,
    width: 400,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2.5px 2.5px 0 rgba(0, 0, 0, 0.04)",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column",
  },
  banner: {
    width: "400px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  instructions: {
    fontSize: "13px",
    paddingTop: "22px",
  },
  icon: {
    marginTop: 40,
    width: 28,
    height: 32,
  },
  help: {
    width: 63,
    textDecoration: "none",
    cursor: "pointer",
    marginRight: "0",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: "0.5",
    transition: "opacity 0.2s ease",
    verticalAlign: "super",
    lineHeight: "1em",
    top: "5px",
    right: "0",
    "&:visited": {
      color: "inherit",
    },
  },
  submit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 40,
  },
  input: {
    textAlign: "center",
  },
  version: {
    fontSize: 11,
    marginTop: 50,
  },
};

const unknownDomainError = new UnknownDomain();

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  login: string => void,
  addMessage: (string, string, ?string) => void,
  addError: Error => void,
  history: *,
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
    domain: "",
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

  onChange = (e: any) => {
    this.setState({ domain: e.currentTarget.value });
  };

  onClose = () => {
    this.setState({ errorDomain: false });
  };

  render() {
    const {
      domain,
      error,
      errorDomain,
      isChecking,
      onboardingToBeDone,
    } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.wrapper}>
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
        <div className={classes.banner}>
          <Logo />
          <HelpLink
            className={classes.help}
            subLink="/Content/operations/signin.htm"
          >
            {t("welcome:help")}
          </HelpLink>
        </div>
        <form className={classes.base}>
          <Profile className={classes.icon} color="#e2e2e2" />
          <br />
          <MUITextField
            autoComplete="off"
            error={error ? domain !== "" : false}
            style={{ width: "320px", marginTop: "5px", color: "black" }}
            InputProps={{
              inputProps: {
                autoComplete: "off",
                style: {
                  fontSize: "13px",
                  color: "black",
                  paddingBottom: "15px",
                  textAlign: "center",
                },
              },
            }}
            disabled={isChecking}
            value={domain}
            id="textField"
            name="email"
            onChange={this.onChange}
            placeholder={t("welcome:placeholder_domain")}
          />
          <br />
          <div className={classes.instructions}>
            {t("welcome:domain_description")}
          </div>
          {this.state.organization && !this.state.error ? (
            <div style={{ position: "absolute", bottom: 10, right: 20 }}>
              <DeviceInteraction
                onSuccess={this.onFinishLogin}
                interactions={loginFlow}
                onError={this.onError}
                additionalFields={{
                  organization: this.state.organization,
                }}
              />
            </div>
          ) : (
            <DialogButton
              className={classes.submit}
              highlight
              disabled={!domain || isChecking}
              right
              onTouchTap={this.onSubmit}
            >
              {t("common:continue")}
            </DialogButton>
          )}
        </form>
        <div className={classes.version}>Vault - v0.2</div>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(withStyles(styles)(translate()(Welcome))));
