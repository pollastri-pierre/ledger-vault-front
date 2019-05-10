// @flow
import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { logout } from "redux/modules/auth";
import Card from "components/base/Card";
import VaultCentered from "components/VaultCentered";

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
      return (
        <VaultCentered>
          <Card height={350} align="center" justify="center">
            Logging out...
          </Card>
        </VaultCentered>
      );
    }
    return <Redirect to={{ pathname: "/" }} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
