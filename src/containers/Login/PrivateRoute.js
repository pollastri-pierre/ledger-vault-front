//@flow
import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  match,
  ...rest
}: {
  component: React$ComponentType<*>,
  isAuthenticated: boolean,
  match: *
}) => (
  <Route
    {...rest}
    render={(props: *) => {
      return isAuthenticated ? (
        <Component {...props} match={match} />
      ) : (
        <Redirect
          to={`${match.url}/login?redirectTo=${encodeURIComponent(
            props.location.pathname
          )}`}
        />
      );
    }}
  />
);

export default connect(mapStateToProps, () => ({}))(PrivateRoute);
