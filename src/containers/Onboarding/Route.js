//@flow
import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { viewRoute } from "redux/modules/onboarding";

const mapDispatchToProps = dispatch => {
  return {
    viewRoute: to => dispatch(viewRoute(to))
  };
};

class RouteOnboarding extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      this.props.viewRoute(nextProps.path);
    }
  }
  componentDidMount() {
    this.props.viewRoute(this.props.path);
  }

  render() {
    return <Route {...this.props} />;
  }
}

export default connect(undefined, mapDispatchToProps)(RouteOnboarding);
