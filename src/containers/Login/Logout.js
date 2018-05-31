//@flow
import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { logout } from "redux/modules/auth";

const mapDispatchToProps = (dispatch: *) => ({
  logout: () => dispatch(logout())
});

export class Logout extends Component<{
  logout: Function
}> {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return <Redirect to={{ pathname: "/" }} />;
  }
}

export default connect(undefined, mapDispatchToProps)(Logout);
