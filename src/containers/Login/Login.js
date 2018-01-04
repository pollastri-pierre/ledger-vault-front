//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";
import createDevice from "../../device";
import "../../containers/App/App.css";
import TeamLogin from "./TeamLogin";
import DeviceLogin from "./DeviceLogin";
import { login, logout } from "../../redux/modules/auth";
import { addMessage } from "../../redux/modules/alerts";
import network from "../../network";

import "./Login.css";

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated
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
  onLogin: string => void,
  addAlertMessage: (
    title: string,
    content: string,
    messageType: ?string
  ) => void
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

  onStartAuth = async () => {
    const { addAlertMessage, onLogin } = this.props;
    this.setState({ isChecking: true });
    try {
      const device = await createDevice();
      const { id, challenge } = await network(
        "/authentication_challenge",
        "GET"
      );
      this.setState({
        error: null,
        domainValidated: true
      });
      const { authentication, pub_key } = await device.authenticate(challenge);
      const { token } = await network("/authenticate", "POST", {
        pub_key,
        authentication,
        id
      });
      this.setState({ isChecking: false });
      addAlertMessage("Welcome", "Hello. Welcome on Ledger Vault Application");
      onLogin(token);
    } catch (error) {
      console.error(error);
      this.setState({ error, isChecking: false });
      addAlertMessage(
        "Unknown domain domain",
        "This domain domain is unkown. Contact your administrator to get more information.",
        "error"
      );
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

    if (domainValidated) {
      content = (
        <DeviceLogin
          domain={domain}
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
          onStartAuth={this.onStartAuth}
          onCloseTeamError={this.onCloseTeamError}
        />
      );
    }
    return (
      <div style={{ display: "table", width: "100vw", height: "100vh" }}>
        <div
          style={{
            display: "table-cell",
            textAlign: "center",
            verticalAlign: "middle"
          }}
        >
          <div className="Background">
            <div className="Banner">
              <img
                src="img/logo-black.png"
                srcSet="/img/logo-black@2x.png 2x, /img/logo-black@3x.png 3x"
                alt="Ledger Vault"
              />
              <div className="help">{t("login.help")}</div>
            </div>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
