import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from '../../decorators/Translate';
import { TextField, DialogButton } from '../../components';

class TeamLogin extends Component {
  constructor(props) {
    super(props);

    this.selectTeam = this.selectTeam.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.confirm);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.confirm);
  }

  selectTeam() {
    if (this.props.team !== '' && !this.props.isChecking) {
      this.props.onStartAuth();
    }
  }

  confirm(e) {
    if (e.charCode === 13) {
      this.selectTeam();
    }
  }

  handleRequestClose = () => {
    this.props.onCloseTeamError();
  }

  render() {
    this.t = this.props.translate;
    return (
      <div className="TeamLogin">
        <img className="user" src="img/logo.png" alt="Ledger Vault" />
        <br />
        <TextField
          onKeyDown={this.confirm}
          hasError={this.props.teamError}
          style={{ width: '320px' }}
          disabled={this.props.isChecking}
          inputStyle={{ textAlign: 'center' }}
          value={this.props.team}
          id="textField"
          errorText=""
          onChange={this.props.onChange}
          hintStyle={{ textAlign: 'center', width: '100%' }}
          hintText={this.t('login.hint')}
        /><br />
        <div className="instructions" >{this.t('login.instructions')}</div>
        <DialogButton highlight right onTouchTap={this.selectTeam}>{this.t('common.continue')}</DialogButton>
      </div>
    );
  }
}

TeamLogin.propTypes = {
  translate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onStartAuth: PropTypes.func.isRequired,
  onCloseTeamError: PropTypes.func.isRequired,
  isChecking: PropTypes.bool.isRequired,
  team: PropTypes.string.isRequired,
  teamError: PropTypes.bool.isRequired,
};

export default translate(TeamLogin);
