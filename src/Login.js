//
// Sandbox for tests and stuff
//
import { Route, Redirect, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';

import './Login.css';
import { deviceRegisterRequest, loginU2f, logout, setCurrentUser } from './actions';

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
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.forceAuth = this.forceAuth.bind(this);
  }

  setEmail(e, newVal) {
    this.setState({ email: newVal });
  }

  register() {
    this.props.deviceRegisterRequest(this.state.email, global.u2f, (e) => {
      this.response.setState(e);
    });
  }

  login() {
    this.props.loginU2f(this.state.email, global.u2f, (e) => {
      console.log(e);
      this.setState({ response: e });
    });
  }

  forceAuth() {
    this.props.setCurrentUser(this.state.email);
    console.log(this);
    this.props.history.push(this.props.reroute);
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
    return (
      <div className="SandBox">
        <div>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis tempus
          massa, sed consectetur est. Integer ultricies finibus lobortis. In quis tincidunt
          mauris, ut tempus magna. Mauris pretium libero neque, id ullamcorper ex pellentesque
          a. Nulla condimentum neque at quam hendrerit, imperdiet suscipit orci rhoncus. Proin
          a felis placerat, tristique est vitae, auctor elit. Maecenas semper volutpat commodo.
          Maecenas quis mattis neque, eget bibendum enim. Fusce ut cursus diam. Proin eget nisl
          in massa euismod rhoncus. Fusce interdum orci id lacinia luctus. Sed magna lectus,
          sodales quis ex eget, tempor molestie velit. Donec urna tortor, volutpat id odio quis,
          gravida ultricies urna. Praesent et fringilla magna, et rhoncus eros. Maecenas mollis
          lacinia laoreet. Mauris tortor ex, suscipit a mi ac, fringilla blandit lorem.
          </p>
        </div>
        <TextField
          hintText="Email"
          value={this.state.email}
          onChange={this.setEmail}
        /><br />
        <RaisedButton
          label="register device"
          onClick={this.register}
        />

        <RaisedButton
          label="testing redirection (force auth)"
          onClick={this.forceAuth}
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

Login.defaultProps = {
  reroute: '/',
};

Login.propTypes = {
  deviceRegisterRequest: React.PropTypes.func.isRequired,
  loginU2f: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  reroute: React.PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  return {
    reroute: state.setReroute.reroute,
    auth: state.auth,
  };
}

export default withRouter(connect(mapStateToProps, { deviceRegisterRequest, loginU2f, logout, setCurrentUser })(Login));
