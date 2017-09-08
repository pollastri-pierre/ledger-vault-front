import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { withRouter } from 'react-router-dom';
import { fetchProfile } from '../../redux/modules/profile';
import 'open-sans-fontface/open-sans.css';
import 'material-design-icons/iconfont/material-icons.css';

import { ActionBar, Content, Menu } from '../../components';

import './App.css';

// Set blur status to root element on dispatch
const mapStateToProps = state => ({ 
  blurredBG: state.blurBG.blurredBG > 0,
  profile: state.profile
});

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: () => dispatch(fetchProfile())
  }
};


// Required by Material-UI
injectTapEventPlugin();

function App(props) {
  return (
    <div className={`App ${props.blurredBG ? 'blurred' : ''}`}>
      <ActionBar profile={props.profile} fetch={props.onFetchProfile}/>
      <div className="Main">
        <Menu />
        <Content />
      </div>
    </div>
  );
}

App.propTypes = {
  blurredBG: PropTypes.bool.isRequired,
  profile: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

