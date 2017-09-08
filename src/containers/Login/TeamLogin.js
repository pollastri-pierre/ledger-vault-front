import React, { Component } from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import translate from '../../decorators/Translate';
// import { checkTeam } from './actions';

import { Alert, TextField, DialogButton } from '../../components';

class TeamLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      response: '',
      snackOpen: false,
      dialogOpen: false,
      disabled: false,
      error: props.error,
      team: props.team,
    };
    this.selectTeam = this.selectTeam.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentWillReceiveProps(props) {
    // console.log("will receive pops")
    // if (props.error) {
    //   this.setState({ error: true, disabled: false });
    // }
  }

  handleChange = (e, newVal) => {
    // this.setState({ team: newVal });
    // this.setState({ error: false });
  }

  selectTeam() {
    // console.log(this);
    // this.setState({ disabled: true });
    if (this.props.team !== '' && !this.props.isChecking) {
      this.props.onStartAuth();
    }
    // this.props.checkTeam(this.state.team);
  }

  confirm(e) {
    // if (e.key === 'Enter') {
    //   this.selectTeam();
    // }
  }

  handleRequestClose = () => {
    // this.setState({ error: false });
    this.props.onCloseTeamError();
  }

  render() {
    this.t = this.props.translate;
    return (
      <div className="TeamLogin">
        <Alert
          onRequestClose={this.handleRequestClose}
          open={(this.props.teamError)}
          autoHideDuration={4000}
          title={this.t('login.wrongDomainTitle')}
        >
          <div>{this.t('login.wrongDomainMessage')}</div>
        </Alert>
        <img className="user" src="img/logo.png" alt="Ledger Vault" />
        <br/>
        <TextField
          onKeyDown={this.confirm}
          hasError={this.state.error}
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

TeamLogin.defaultProps = {
  team: '',
  isChecking: false
};

TeamLogin.propTypes = {
  translate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  // error: React.PropTypes.bool.isRequired,
  // checkTeam: React.PropTypes.func.isRequired,
  isCheking: PropTypes.bool,
  team: PropTypes.string,
};

export default translate(TeamLogin);
