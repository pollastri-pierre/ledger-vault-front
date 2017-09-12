import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import isEmpty from 'lodash/isEmpty';

import { connect } from 'react-redux';
import { logoutAction } from '../../redux/modules/auth';


const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutAction()),
  }
};


class Logout extends Component {

  componentWillMount() {
    this.props.logout();
  }

  render() {
    return (
      <Redirect to={{pathname: '/'}} />
    );
  }
}
export default connect(undefined, mapDispatchToProps)(Logout);


