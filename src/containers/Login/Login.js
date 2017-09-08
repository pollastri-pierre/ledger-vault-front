import '../../containers/App/App.css';
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

import { connect } from 'react-redux';
import { Alert } from '../../components';
import translate from '../../decorators/Translate';
import TeamLogin from './TeamLogin';
import DeviceLogin from './DeviceLogin';
import { setTeamField, logout, startAuthentication, reinitTeamError, resetTeam } from '../../redux/modules/auth';

import './Login.css';

const mapStateToProps = state => ({ 
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
  return {
    onFieldTeam: (e, val) => dispatch(setTeamField(val)),
    onLogout: () => dispatch(logout()),
    onStartAuth: () => dispatch(startAuthentication()),
    onCloseTeamError: () => dispatch(reinitTeamError()),
    onResetTeam: () => dispatch(resetTeam())
  }
};


class Login extends Component {
  render() {
    this.t = this.props.translate;
    let content = null;
    const { team, isCheckingTeam, teamError, teamValidated } = this.props.auth;

    if (teamValidated) {
      content = (<DeviceLogin
        team={team}
        onCancel={this.props.onResetTeam}
      />);

    } else {
      content = (<TeamLogin
        team={team}
        teamError={teamError}
        isChecking={isCheckingTeam}
        onChange={this.props.onFieldTeam}
        onLogout={this.props.onLogout}
        onStartAuth={this.props.onStartAuth}
        onCloseTeamError={this.props.onCloseTeamError}
      />);
    }
    return (
      <div>
        <Alert
          onRequestClose={this.handleRequestClose}
          open={false}
          theme="success"
          autoHideDuration={4000}
          title={this.t('login.logoutTitle')}
        >
          <div>{this.t('login.logoutMessage')}</div>
        </Alert>
        <Alert
          onRequestClose={this.handleRequestClose}
          open={false}
          autoHideDuration={4000}
          theme="error"
          style={{
            width: '380px',
            height: '135px',
          }}
          title={this.t('login.sessionClosedTitle')}
        >
          <div>{this.t('login.sessionClosedMessage')}</div>
        </Alert>
        <div className="Background" >
          <div className="Banner" >
            <img src="img/logo.png" alt="Ledger Vault" />
            <div className="help" >{this.t('login.help')}</div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

// Login.defaultProps = {
//   reroute: '/',
//   team: '',
// };
//
// Login.propTypes = {
//   translate: React.PropTypes.func.isRequired,
//   team: React.PropTypes.string,
// };

export default connect(mapStateToProps, mapDispatchToProps)(translate(Login));
