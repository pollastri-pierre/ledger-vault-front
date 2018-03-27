//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import queryString from "query-string";
import formatError from "formatters/error";
import createDevice, { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
import TeamLogin from "./TeamLogin";
import DeviceLogin from "./DeviceLogin";
import { login, logout } from "redux/modules/auth";
import { addMessage } from "redux/modules/alerts";
import network from "network";
import { withStyles } from "material-ui/styles";

import logoBlack from "assets/img/logo-black.png";
import logoBlack2x from "assets/img/logo-black@2x.png";
import logoBlack3x from "assets/img/logo-black@3x.png";

const mapStateToProps = ({ auth, onboarding }) => ({
  isAuthenticated: auth.isAuthenticated,
  onboarding: onboarding
});

const mapDispatchToProps = dispatch => ({
  onLogin: token => dispatch(login(token)),
  onLogout: () => dispatch(logout()),
  addAlertMessage: (...props) => dispatch(addMessage(...props))
});

type Props = {
  isAuthenticated: boolean,
  history: Object,
  location: Object,
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
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: "0.5",
    transition: "opacity 0.2s ease",
    verticalAlign: "super",
    lineHeight: "1em",
    position: "absolute",
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

export class Login extends Component<Props, State> {
  context: {
    translate: string => string
  };

  state = {
    domain: "",
    error: null,
    domainValidated: false,
    isChecking: false
  };

  componentWillMount() {
    const { isAuthenticated, history, location } = this.props;
    if (isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.replace(redirectTo || "/");
    }
  }

  componentDidMount() {
    this.onStartAuth();
  }

  componentWillUpdate(nextProps: Props) {
    const { history, location } = nextProps;
    if (nextProps.isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.push(redirectTo || "/");
    }
  }

  onTeamChange = (domain: string) => {
    this.setState({ domain, error: null });
  };

  onStartOnBoardingStatus = async () => {
    const { history } = this.props;
    try {
      // const { status } = await network("/onboarding_status", "GET");
      if (true) {
        this.onStartAuth();
      } else if (status === 0) {
        history.push("/onboarding/welcome");
      } else {
        history.push("/onboarding/seed/signin");
      }
    } catch (e) {
      console.error(e);
    }
  };

  onStartAuth = async () => {
    const { addAlertMessage, onLogin } = this.props;
    this.setState({ isChecking: true });
    try {
      console.log(this.props.onboarding);
      const device = await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      const { challenge } = await network(
        `/hsm/session/users/challenge`,
        "POST",
        {
          pub_key: pubKey
        }
      );
      this.setState({
        error: null,
        domainValidated: true
      });

      // FIXME these need to come from the server call /authentication_challenge
      const application = APPID_VAULT_ADMINISTRATOR;
      // TODO FIXME not sure what these will be
      const instanceName = "";
      const instanceReference = "";
      const instanceURL = "";
      const agentRole = "";

      const keyHandles = {
        "04b3d3af2d3bcbdc456a69168e1373445852088c3a0300d91ced68e63b481485ac460db1140da4b01e9153e596fa3081f895f19bec67e86ed031c2e7ab2cde1d7e":
          "caa47ca7e904b6646950d5a3687effc85eba78480b5bf1e175fe017c08e9a086755368ea3e8eee768158e4683b48df99d669e0ec8f9b20b5ff05ec6a19441f7c",
        "04fcb3ab839d1bdf48b6a460feb66d6a6dd4db2a1bcdf037aaaaa699ace851451e5380a674ce7bfe8be76326528117858ce492464f97dafbca3b8ef7e0c0debde2":
          "6154039911d1ad143be6847b4fe4e1b91648f423dad6309a7e78ff934e05c6f3bc9a093e935ef1abfa99d74ae95bba97807f766ae9cfb23541e07675c293e26e",
        "04e6673348f1dd6db60817bf359f8743bbd7e5328196fbbdb7d4cd51b59b760f04daeeee5f3bd21a8edd0754619dcb2e4374c702ed38142203979ea7eeebf8661c":
          "4c1f8da6255983e47ffb40589cc48d5759f1a43916da44504c0ab531269564e522c4a05ab2e5f1bb9ba3a686e901868b534f9163c3d2832418c81a692b078163"
      };

      const auth = await device.authenticate(
        Buffer.from(challenge, "base64"),
        application,
        Buffer.from(keyHandles[pubKey], "hex"),
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );

      const { token } = await network("/authentications/authenticate", "POST", {
        pub_key: pubKey.toUpperCase(),
        authentication: auth.rawResponse
      });
      this.setState({ isChecking: false });
      addAlertMessage("Welcome", "Hello. Welcome on Ledger Vault Application");
      onLogin(token);
    } catch (error) {
      console.error(error);
      this.setState({ error, isChecking: false });
      addAlertMessage("Failed to authenticate", formatError(error), "error");
    }
  };

  onCloseTeamError = () => {
    this.setState({ error: null });
  };

  onCancelDeviceLogin = () => {
    this.setState({ domainValidated: false });
  };

  render() {
    const { onLogout } = this.props;
    const { domain, error, domainValidated, isChecking } = this.state;
    const t = this.context.translate;
    let content = null;
    const { classes } = this.props;

    if (true || domainValidated) {
      content = (
        <DeviceLogin
          domain="Pied Piper"
          isChecking={isChecking}
          onCancel={this.onCancelDeviceLogin}
          onRestart={this.onStartAuth}
        />
      );
    } else {
      content = (
        <TeamLogin
          domain={domain}
          error={error}
          isChecking={isChecking}
          onChange={this.onTeamChange}
          onLogout={onLogout}
          onStartAuth={this.onStartOnBoardingStatus}
          onCloseTeamError={this.onCloseTeamError}
        />
      );
    }
    return (
      <div className={classes.base}>
        <div className={classes.wrapper}>
          <div className={classes.banner}>
            <img
              src={logoBlack}
              srcSet={`${logoBlack2x} 2x, ${logoBlack3x} 3x`}
              alt="Ledger Vault"
            />
            <div className={classes.help}>{t("login.help")}</div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Login);
