// @flow
import React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  match,
  ...rest
}: {
  component: React$ComponentType<*>,
  isAuthenticated: boolean,
  match: *,
}) => (
  <Route
    {...rest}
    render={(props: *) => {
      const redirect = `${match.url}/login`;
      if (!isAuthenticated && process.env.NODE_ENV === "production") {
        window.location.href = redirect;
        return null;
      }
      return isAuthenticated ? (
        <Component {...props} match={match} />
      ) : (
        <Redirect to={redirect} />
      );
    }}
  />
);

export default connect(mapStateToProps)(PrivateRoute);
