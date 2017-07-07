import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { withRouter } from 'react-router-dom'
import 'open-sans-fontface/open-sans.css';
import 'material-design-icons/iconfont/material-icons.css';

import ActionBar from './ActionBar';
import Content from './Content';
import Menu from './Menu';
import './App.css';

// Set blur status to root element on dispatch
const mapStateToProps = state => ({ blurredBG: state.blurBG.blurredBG > 0 });

// Required by Material-UI
injectTapEventPlugin();

function App(props) {
  return (
    <div className={`App ${props.blurredBG ? 'blurred' : ''}`}>
      <ActionBar />
      <div className="Main">
        <Menu />
        <Content />
      </div>
    </div>
  );
}

App.propTypes = {
  blurredBG: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps)(App));
