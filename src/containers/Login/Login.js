// @flow
import Card from "components/legacy/Card";
import TranslatedError from "components/TranslatedError";
import connectData from "restlay/connectData";
import { translate } from "react-i18next";
import HelpLink from "components/HelpLink";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import queryString from "query-string";
import OrganizationQuery from "api/queries/OrganizationQuery";
import { UnknownDevice, UnknownDomain } from "utils/errors";
import createDevice, {
  U2F_TIMEOUT,
  checkToUpdate,
  U2F_PATH,
  APPID_VAULT_ADMINISTRATOR
} from "device";
import {
  login,
  setTokenToLocalStorage,
  removeLocalStorageToken
} from "redux/modules/auth";
import { addMessage, addError } from "redux/modules/alerts";
import network from "network";
import { withStyles } from "@material-ui/core/styles";
import Logo from "components/Logo";
import type { Organization, Translate } from "data/types";
import DeviceLogin from "./DeviceLogin";

const unknownDomainError = new UnknownDomain();

const mapStateToProps = ({ auth, onboarding }) => ({
  isAuthenticated: auth.isAuthenticated,
  onboarding
});

const mapDispatchToProps = (dispatch: *) => ({
  onLogin: token => dispatch(login(token)),
  addAlertMessage: (...props) => dispatch(addMessage(...props)),
  addErrorMessage: (...props) => dispatch(addError(...props))
});

type Props = {
  isAuthenticated: boolean,
  t: Translate,
  history: Object,
  match: Object,
  location: Object,
  organization: Organization,
  classes: Object,
  addAlertMessage: (string, string, ?string) => void,
  addErrorMessage: Error => void,
  onLogin: Function
};

const styles = {
  base: {
    display: "table",
    width: "100vw",
    height: "100vh"
  },
  wrapper: {
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle"
  },
  banner: {
    width: "400px",
    margin: "auto",
    marginBottom: "20px",
    position: "relative",
    textAlign: "left"
  },
  help: {
    width: 63,
    cursor: "pointer",
    marginRight: "0",
    position: "absolute",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: "0.5",
    transition: "opacity 0.2s ease",
    verticalAlign: "super",
    lineHeight: "1em",
    top: "5px",
    right: "0;"
  }
};

type State = {
  step: number,
  isChecking: boolean
};

let _isMounted = false;

export class Login extends Component<Props, State> {
  state = {
    step: 0,
    isChecking: false
  };

  UNSAFE_componentWillMount() {
    const { isAuthenticated, history, location } = this.props;
    if (isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.replace(redirectTo || "/");
    }
  }

  componentDidMount() {
    _isMounted = true;
    this.onStartOnBoardingStatus();
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    const { history, location } = nextProps;
    if (nextProps.isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.push(redirectTo || "/");
    }
  }

  onStartOnBoardingStatus = async () => {
    const { history, match } = this.props;
    try {
      const { state } = await network(`/onboarding/state`, "GET");
      if (state !== "COMPLETE") {
        history.push(`/${match.params.orga_name}/onboarding`);
      } else {
        this.onStartAuth();
      }
    } catch (e) {
      console.error(e);
    }
  };

  onStartAuth = async () => {
    if (_isMounted) {
      const {
        organization,
        addErrorMessage,
        addAlertMessage,
        onLogin,
        history
      } = this.props;
      this.setState({ isChecking: true });
      try {
        const device = await await createDevice();
        const isUpToDate = await checkToUpdate(device, () => {
          history.push("/update-app");
        });
        if (isUpToDate) {
          const { pubKey } = await device.getPublicKey(U2F_PATH, false);
          const { token, key_handle } = await network(
            `/u2f/authentications/${pubKey}/challenge`,
            "GET"
          );
          this.setState({ step: 1 });

          const application = APPID_VAULT_ADMINISTRATOR;
          const auth = await device.authenticate(
            Buffer.from(token, "base64"),
            application,
            Buffer.from(key_handle, "hex"),
            organization.name,
            organization.workspace,
            organization.domain_name,
            "Administrator"
          );

          setTokenToLocalStorage(token);
          await network("/u2f/authentications/authenticate", "POST", {
            authentication: auth.rawResponse
          });
          this.setState({ isChecking: false });
          onLogin(token);
          addAlertMessage("Hello", "Welcome to the Ledger Vault platform!");
        }
      } catch (error) {
        console.error(error);
        if (error && error.id === U2F_TIMEOUT && this.state.step !== 1) {
          // timeout we retry
          this.onStartAuth();
        } else {
          removeLocalStorageToken();
          this.setState({ isChecking: false });
          const unknownDeviceError = new UnknownDevice();
          addErrorMessage(unknownDeviceError);
        }
      }
    }
  };

  onCancelDeviceLogin = () => {
    this.props.history.push("/");
  };

  render() {
    const { isChecking } = this.state;
    const { classes, match, t } = this.props;

    return (
      <div className={classes.base}>
        <div className={classes.wrapper}>
          <div className={classes.banner}>
            <Logo />
            <HelpLink className={classes.help}>{t("welcome:help")}</HelpLink>
          </div>
          <DeviceLogin
            domain={`${match.params.orga_name}`}
            isChecking={isChecking}
            onCancel={this.onCancelDeviceLogin}
            onRestart={this.onStartAuth}
          />
        </div>
      </div>
    );
  }
}

const RenderError = () => (
  <div style={{ width: 400, margin: "auto", marginTop: 200 }}>
    <Card title="Error">
      <TranslatedError error={unknownDomainError} field="description" />
    </Card>
  </div>
);
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(
  connectData(translate()(Login), {
    RenderError,
    queries: {
      organization: OrganizationQuery
    }
  })
);
