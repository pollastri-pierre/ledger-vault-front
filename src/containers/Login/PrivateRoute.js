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
  ...rest
}: {
  component: React$ComponentType<*>,
  isAuthenticated: boolean
}) => (
  <Route
    {...rest}
    render={(props: *) => {
      return isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={
            "/login?redirectTo=" + encodeURIComponent(props.location.pathname)
          }
        />
      );
    }}
  />
);

export default connect(mapStateToProps, () => {})(PrivateRoute);
