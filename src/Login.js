import './App.css';

import { Route, Redirect, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';
import TextField from './TextField';
import { connect } from 'react-redux';
import DialogButton from './DialogButton';
import translate from './translate';
import TeamLogin from './TeamLogin';
import DeviceLogin from './DeviceLogin';

import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      response: '',
      snackOpen: false,
      dialogOpen: false,
      disabled: false,
      error: false,
      team: '',
    };
  }
 
  componentWillMount() {
    localStorage.setItem('email', this.props.match.params.email);
  }

  render() {
    this.t = this.props.translate;
    let content = null;
    if ((!isEmpty(this.props.team)) && (this.props.team !== 'error')) {
      content = <DeviceLogin team={localStorage.team} />;
    } else {
      content = <TeamLogin error={this.props.team === 'error'} />;
    }
    return (
      <div className="Background" >
        <div className="Banner" >
          <img src="img/logo.png" alt="Ledger Vault" />
          <div className="help" >{this.t('login.help')}</div>
        </div>
        {content}
      </div>
    );
  }
}

Login.defaultProps = {
  reroute: '/',
  team: '',
};

Login.propTypes = {
  translate: React.PropTypes.func.isRequired,
  setCurrentUser: React.PropTypes.func.isRequired,
  team: React.PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  return {
    reroute: state.setReroute.reroute,
    team: state.auth.team,
  };
}

export default withRouter(connect(mapStateToProps)(translate(Login)));
