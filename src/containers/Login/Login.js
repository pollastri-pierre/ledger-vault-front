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
  email: string,
  isChecking: boolean,
  error: ?Error,
  emailValidated: boolean
};

export class Login extends Component<Props, State> {
  context: {
    translate: string => string
  };

  state = {
    email: "",
    error: null,
    emailValidated: false,
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

  onTeamChange = (email: string) => {
    this.setState({ email, error: null });
  };

  onStartAuth = async () => {
    const { addAlertMessage, onLogin } = this.props;
    this.setState({ isChecking: true });
    try {
      const device = await createDevice();
      const token = await device.authenticate(this.state.email);
      this.setState({ isChecking: false });
      addAlertMessage("Welcome", "Hello. Welcome on Ledger Vault Application");
      onLogin(token);
    } catch (error) {
      console.error(error);
      this.setState({ error, isChecking: false });
      addAlertMessage(
        "Unknown email domain",
        "This email domain is unkown. Contact your administrator to get more information.",
        "error"
      );
    }
  };

  onCloseTeamError = () => {
    this.setState({ error: null });
  };

  onCancelDeviceLogin = () => {
    this.setState({ emailValidated: false });
  };

  render() {
    const { onLogout } = this.props;
    const { email, error, emailValidated, isChecking } = this.state;
    const t = this.context.translate;
    let content = null;

    if (emailValidated) {
      content = (
        <DeviceLogin email={email} onCancel={this.onCancelDeviceLogin} />
      );
    } else {
      content = (
        <TeamLogin
          email={email}
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
