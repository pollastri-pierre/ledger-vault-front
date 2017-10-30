import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  auth: state.auth
});

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

PrivateRoute.propTypes = {
  // component: PropTypes.element.isRequired,
  auth: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
};

export default connect(mapStateToProps)(PrivateRoute);
