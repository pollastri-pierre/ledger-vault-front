import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { logoutAction } from '../../redux/modules/auth';

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutAction()),
});


export class Logout extends Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return (
      <Redirect to={{ pathname: '/' }} />
    );
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default connect(undefined, mapDispatchToProps)(Logout);

