//
// Sandbox for tests and stuff
//
import { Route, Redirect, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import TabBar from './TabBar';
import asTab from './Tab';
import ExampleTab from './ExampleTab';


import './Login.css';
import { deviceRegisterRequest, loginU2f, logout, setCurrentUser } from './actions';

class Logintest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      response: '',
      snackOpen: false,
      dialogOpen: false,
      toggle: 1,
      titi: asTab(ExampleTab, 0),
      blah: asTab(ExampleTab, 1),
      sdksdksdk: asTab(ExampleTab, 2),
    };
    this.setEmail = this.setEmail.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.forceAuth = this.forceAuth.bind(this);
  }

  setEmail(e, newVal) {
    this.setState({ email: newVal });
  }

  register() {
    this.props.deviceRegisterRequest(this.state.email, global.u2f);
  }

  login() {
    localStorage.setItem('email', this.state.email);
    this.props.loginU2f(global.u2f, () => this.props.history.push(localStorage.reroute));
  }

  forceAuth() {
    this.props.setCurrentUser(this.state.email);
    localStorage.setItem('token', 'forcedtoken');
    localStorage.setItem('clearanceLevel', 'all');
    console.log(localStorage.reroute);
    this.props.history.push(localStorage.reroute);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  toggle = () => {
    this.setState({ toggle: this.state.toggle * -1 })
    console.log(this.state.toggle)
  }

  render() {
    let tabs;
    if (this.state.toggle > 0) {
      tabs = null;
    } else {
      tabs = (
        <div className="tabs">
          <TabBar id="popol" sequential titles={['titi', 'blah', 'fdslkuga']} >
            <this.state.titi />
            <this.state.blah />
            <this.state.sdksdksdk />
          </TabBar>
        </div>
      );
    }
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
        <RaisedButton
          label="logout"
          onClick={this.logout}
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
          multiLine
          rows={5}
        /><br />
        <RaisedButton
          label="toggle tabbar"
          onClick={this.toggle}
        />
        <div className="tabs2">
          <TabBar
            id="tilititu"
            tabs={
            [
              {
                title: ' titi',
                content: ExampleTab,
              },
              {
                title: ' toto',
                content: ExampleTab,
              },
              {
                title: ' tutu',
                content: ExampleTab,
              },
            ]
            }
          />
        </div>
        <br/>
        {tabs}
      </div>
    );
  }
}

Logintest.defaultProps = {
  reroute: '/',
};

Logintest.propTypes = {
  deviceRegisterRequest: React.PropTypes.func.isRequired,
  loginU2f: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  reroute: React.PropTypes.string,
  setCurrentUser: React.PropTypes.func.isRequired,
  history: React.PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    reroute: state.setReroute.reroute,
    auth: state.auth,
  };
}

export default withRouter(connect(mapStateToProps, { deviceRegisterRequest, loginU2f, logout, setCurrentUser })(Logintest));
