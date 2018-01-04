//@flow
import "./App/App.css";
import React, { Component } from "react";
import "./Login/Login.css";

class LoginTest extends Component<{}, { field: string }> {
  state = {
    field: ""
  };

  onChange = (e: SyntheticEvent<*>) => {
    this.setState({
      field: e.currentTarget.value
    });
  };

  onSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    console.error("NOT IMPLEMENTED", e);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          value={this.state.field}
          onChange={this.onChange}
          placeholder="email address"
        />
        <button type="submit">register device</button>
      </form>
    );
  }
}
export default LoginTest;
