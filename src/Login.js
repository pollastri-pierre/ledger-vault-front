//
// Sandbox for tests and stuff
//

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import './Login.css';
import { deviceRegisterRequest, loginU2f, logout } from './actions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      response: '',
      snackOpen: false,
      dialogOpen: false,
    };
    this.setEmail = this.setEmail.bind(this);
    this.sendAjax = this.sendAjax.bind(this);
    this.login = this.login.bind(this);
  }

  setEmail(e, newVal) {
    this.setState({ email: newVal });
  }

  sendAjax() {
    this.props.deviceRegisterRequest(this.state.email, global.u2f, (e) => {
      console.log(e);
      this.setState({ response: e });
    });
  }

  login() {
    this.props.loginU2f(this.state.email, global.u2f, (e) => {
      console.log(e);
      this.setState({ response: e });
    });
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  switchLanguage = () => {
    if (window.localStorage.getItem('locale') === 'en') {
      window.localStorage.setItem('locale', 'fr');
    } else {
      window.localStorage.setItem('locale', 'en');
    }

    document.location.reload();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="SandBox">
        <h2> Logged in = {isAuthenticated} </h2>
        <h1>U2F test page</h1>
        <TextField
          hintText="Email"
          value={this.state.email}
          onChange={this.setEmail}
        /><br />
        <RaisedButton
          label="register device"
          onClick={this.sendAjax}
        />
        <br/>
        <RaisedButton
          label="login with device"
          onClick={this.login}
        />
        <RaisedButton
          label="logout"
          onClick={this.logout}
        />
        <br/>
        <TextField
          value={this.state.response}
        /><br />
        <br/>
      </div>
    );
  }
}

Login.propTypes = {
  deviceRegisterRequest: React.PropTypes.func.isRequired,
  loginU2f: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { deviceRegisterRequest, loginU2f, logout })(Login);
