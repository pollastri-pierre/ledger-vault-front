import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'open-sans-fontface/open-sans.css';
import 'material-design-icons/iconfont/material-icons.css';
import { withRouter } from 'react-router-dom';
import { logout } from '../../redux/modules/auth';
import { openCloseProfile, openCloseEdit, saveProfile } from '../../redux/modules/profile';
import { openModalAccount } from '../../redux/modules/account-creation';
import { openModalOperation } from '../../redux/modules/operation-creation';
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
  onSaveProfile: (error, profile) => dispatch(saveProfile(error, profile)),
  onOpenCloseEdit: () => dispatch(openCloseEdit()),
  onGetAccounts: () => dispatch(getAccounts()),
  onOpenAccount: () => dispatch(openModalAccount()),
  onOpenOperation: () => dispatch(openModalOperation()),
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
        saveProfile={props.onSaveProfile}
        openCloseEdit={props.onOpenCloseEdit}
        openAccount={props.onOpenAccount}
        pathname={props.routing.location.pathname}
      />
      <div className="Main">
        <Menu
          getAccounts={props.onGetAccounts}
          accounts={props.accounts}
          openOperation={props.onOpenOperation}
          pathname={props.routing.location.pathname}
        />
        <Content />
      </div>
    </div>
  );
}
App.defaultProps = {
  profile: {},
  accounts: [],
};

App.propTypes = {
  blurredBG: PropTypes.bool.isRequired,
  accounts: PropTypes.shape({}),
  onLogout: PropTypes.func.isRequired,
  onOpenCloseProfile: PropTypes.func.isRequired,
  onGetAccounts: PropTypes.func.isRequired,
  onOpenAccount: PropTypes.func.isRequired,
  onOpenOperation: PropTypes.func.isRequired,
  onOpenCloseEdit: PropTypes.func.isRequired,
  profile: PropTypes.shape({}),
  onSaveProfile: PropTypes.func.isRequired,
  routing: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export { App as AppNotDecorated };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

