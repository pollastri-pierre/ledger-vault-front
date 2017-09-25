import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'open-sans-fontface/open-sans.css';
import 'material-design-icons/iconfont/material-icons.css';
import { withRouter } from 'react-router-dom';
import { logout } from '../../redux/modules/auth';
import { openCloseProfile, openCloseEdit } from '../../redux/modules/profile';
import { getAccounts } from '../../redux/modules/accounts';
import { ActionBar, Content, Menu } from '../../components';

import './App.css';

// Set blur status to root element on dispatch
const mapStateToProps = state => ({
  blurredBG: state.blurBG.blurredBG > 0,
  profile: state.profile,
  accounts: state.accounts,
  routing: state.routing,
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  onOpenCloseProfile: target => dispatch(openCloseProfile(target)),
  onOpenCloseEdit: () => dispatch(openCloseEdit()),
  onGetAccounts: () => dispatch(getAccounts()),
});

// Required by Material-UI
injectTapEventPlugin();


function App(props) {
  return (
    <div className={`App ${props.blurredBG ? 'blurred' : ''}`}>
      <ActionBar
        profile={props.profile}
        logout={props.onLogout}
        openCloseProfile={props.onOpenCloseProfile}
        openCloseEdit={props.onOpenCloseEdit}
      />
      <div className="Main">
        <Menu 
          getAccounts={props.onGetAccounts}
          accounts={props.accounts}
          pathname={props.routing.location.pathname}
        />
        <Content />
      </div>
    </div>
  );
}
App.defaultProps = {
  profile: {},
};

App.propTypes = {
  blurredBG: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  onOpenCloseProfile: PropTypes.func.isRequired,
  onOpenCloseEdit: PropTypes.func.isRequired,
  profile: PropTypes.shape({}),
};

export { App as AppNotDecorated };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

