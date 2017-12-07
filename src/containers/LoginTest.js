//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { registerDevice } from "../redux/modules/auth";

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    register: val => dispatch(registerDevice(val))
  };
};

class LoginTest extends Component<*, *> {
  state = {
    field: ""
  };

  onChange(event: *) {
    this.setState({
      field: event.target.value
    });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.field}
          onChange={this.onChange.bind(this)}
          placeholder="email address"
        />
        <button onClick={this.props.register.bind(this, this.state.field)}>
          register device
        </button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginTest);
