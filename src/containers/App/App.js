import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'open-sans-fontface/open-sans.css';
import 'material-design-icons/iconfont/material-icons.css';
import { withRouter } from 'react-router-dom';
import { logout } from '../../redux/modules/auth';

import { ActionBar, Content, Menu } from '../../components';

import './App.css';

// Set blur status to root element on dispatch
const mapStateToProps = state => ({
  blurredBG: state.blurBG.blurredBG > 0,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => {
  return { onLogout: () => dispatch(logout()) };
};


// Required by Material-UI
injectTapEventPlugin();

function App(props) {
  return (
    <div className={`App ${props.blurredBG ? 'blurred' : ''}`}>
      <ActionBar profile={props.profile} logout={props.onLogout} />
      <div className="Main">
        <Menu />
        <Content />
      </div>
    </div>
  );
}

App.propTypes = {
  blurredBG: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  profile: PropTypes.object,
};

export {App as App};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

