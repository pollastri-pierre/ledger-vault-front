import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../containers/App/App.css';
import TeamLogin from './TeamLogin';
import DeviceLogin from './DeviceLogin';
import { setTeamField, logout, startAuthentication, reinitTeamError, resetTeam } from '../../redux/modules/auth';

import './Login.css';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  onFieldTeam: (e, val) => dispatch(setTeamField(val)),
  onLogout: () => dispatch(logout()),
  onStartAuth: () => dispatch(startAuthentication()),
  onCloseTeamError: () => dispatch(reinitTeamError()),
  onResetTeam: () => dispatch(resetTeam()),
});


export class Login extends Component {
  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  render() {
    const t = this.context.translate;
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
        <div className="Background" >
          <div className="Banner" >
            <img src="img/logo.png" alt="Ledger Vault" />
            <div className="help" >{t('login.help')}</div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isCheckingTeam: PropTypes.bool,
    teamError: PropTypes.bool,
    teamValidated: PropTypes.bool,
    team: PropTypes.string,
  }).isRequired,
  onFieldTeam: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onStartAuth: PropTypes.func.isRequired,
  onCloseTeamError: PropTypes.func.isRequired,
  onResetTeam: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

Login.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
