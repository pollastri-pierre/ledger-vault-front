//@flow
import SpinnerCard from "components/spinners/SpinnerCard";
import connectData from "restlay/connectData";
import HelpLink from "components/HelpLink";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import queryString from "query-string";
import formatError from "formatters/error";
import OrganizationQuery from "api/queries/OrganizationQuery";
import createDevice, {
  U2F_TIMEOUT,
  U2F_PATH,
  APPID_VAULT_ADMINISTRATOR
} from "device";
import DeviceLogin from "./DeviceLogin";
import {
  login,
  logout,
  setTokenToLocalStorage,
  removeLocalStorageToken
} from "redux/modules/auth";
import { addMessage } from "redux/modules/alerts";
import network from "network";
import { withStyles } from "@material-ui/core/styles";
import Logo from "components/Logo";
import type { Organization } from "data/types";

const mapStateToProps = ({ auth, onboarding }) => ({
  isAuthenticated: auth.isAuthenticated,
  onboarding: onboarding
});

const mapDispatchToProps = (dispatch: *) => ({
  onLogin: token => dispatch(login(token)),
  onLogout: () => dispatch(logout()),
  addAlertMessage: (...props) => dispatch(addMessage(...props))
});

type Props = {
  isAuthenticated: boolean,
  history: Object,
  match: Object,
  location: Object,
  organization: Organization,
  onLogout: () => void,
  onStartAuth: () => void,
  onCloseTeamError: () => void,
  onResetTeam: () => void,
  classes: Object,
  addAlertMessage: Function,
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
  domain: string,
  isChecking: boolean,
  error: ?Error,
  domainValidated: boolean
};

let _isMounted = false;

export class Login extends Component<Props, State> {
  state = {
    domain: "",
    error: null,
    domainValidated: false,
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
    this.checkDomain();
    _isMounted = true;
    this.onStartOnBoardingStatus();
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  checkDomain = async () => {
    const { history, addAlertMessage } = this.props;
    try {
      await network(`/organization/exists`, "GET");
      this.setState({ domainValidated: true });
    } catch (e) {
      console.error(e);
      this.setState({ domainValidated: false });
      history.push("/");
      addAlertMessage("Error", "Team domain unknown", "error");
    }
  };

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
      const { organization, addAlertMessage, onLogin } = this.props;
      this.setState({ isChecking: true });
      try {
        const device = await await createDevice();
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        const { token, key_handle } = await network(
          `/authentications/${pubKey}/challenge`,
          "GET"
        );
        this.setState({
          error: null
        });

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
        await network("/authentications/authenticate", "POST", {
          authentication: auth.rawResponse.slice(0, auth.rawResponse.length - 4)
        });
        this.setState({ isChecking: false });
        onLogin(token);
        addAlertMessage(
          "Welcome",
          "Hello. Welcome on Ledger Vault Application"
        );
      } catch (error) {
        console.error(error);
        if (error && error.id === U2F_TIMEOUT) {
          // timeout we retry
          this.onStartAuth();
        } else {
          removeLocalStorageToken();
          this.setState({ error, isChecking: false });
          addAlertMessage(
            "Failed to authenticate",
            formatError(error),
            "error"
          );
        }
      }
    }
  };

  onCloseTeamError = () => {
    this.setState({ error: null });
  };

  onCancelDeviceLogin = () => {
    this.setState({ domainValidated: false });
    this.props.history.push("/");
  };

  render() {
    const { isChecking, domainValidated } = this.state;
    const { classes, match } = this.props;

    if (!domainValidated) {
      return (
        <div className={classes.base}>
          <SpinnerCard />
        </div>
      );
    }
    return (
      <div className={classes.base}>
        <div className={classes.wrapper}>
          <div className={classes.banner}>
            <Logo />
            <HelpLink className={classes.help}>Support</HelpLink>
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(
  connectData(Login, {
    queries: {
      organization: OrganizationQuery
    }
  })
);
