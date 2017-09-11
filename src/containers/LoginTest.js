import './App/App.css';
import React, { Component } from 'react';
// import isEmpty from 'lodash/isEmpty';

import { connect } from 'react-redux';
import { registerDevice } from '../redux/modules/auth';

import './Login/Login.css';

const mapStateToProps = state => ({ 
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
  return {
    register: (val) => dispatch(registerDevice(val)),
  }
};


class LoginTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      field: ''
    }
  }

  onChange(event) {
    this.setState({
      field: event.target.value
    });
  }

  render() {
    // const { team, isCheckingTeam, teamError, teamValidated } = this.props.auth;

    return (
      <div>
        <input
          type="text"
          value={this.state.field}
          onChange={this.onChange.bind(this)}
          placeholder="email address"
        />
        <button onClick={this.props.register.bind(this, this.state.field)}>register device</button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginTest);

