import React from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ 
  auth: state.auth
});

const PrivateRoute = ({ component: Component, auth, ...rest }) => (

  <Route {...rest} render={props => {
		return (
			auth.isAuthenticated ? (
				<Component {...props}/>
			) : (
				<Redirect to={{
					pathname: '/login',
					state: { from: props.location }
				}}/>
			)
		);
  }}/>
)

export default connect(mapStateToProps)(PrivateRoute);
