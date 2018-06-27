//@flow
import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { logout } from "redux/modules/auth";

const mapDispatchToProps = (dispatch: *) => ({
  logout: org => dispatch(logout(org))
});

export class Logout extends Component<{
  logout: Function,
  match: *
}> {
  componentDidMount() {
    this.props.logout(this.props.match.params.orga_name);
  }

  render() {
    return <Redirect to={{ pathname: "/" }} />;
  }
}

export default connect(undefined, mapDispatchToProps)(Logout);
