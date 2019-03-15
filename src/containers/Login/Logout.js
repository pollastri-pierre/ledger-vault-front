// @flow
import React, { Component } from "react";
import { Redirect } from "react-router";
import SpinnerCard from "components/spinners/SpinnerCard";
import { connect } from "react-redux";
import { logout } from "redux/modules/auth";

const mapDispatchToProps = (dispatch: *) => ({
  logout: () => dispatch(logout()),
});

const mapStateToProps = state => ({
  auth: state.auth,
});

export class Logout extends Component<{
  logout: Function,
  auth: *,
}> {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      return <SpinnerCard />;
    }
    return <Redirect to={{ pathname: "/" }} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
