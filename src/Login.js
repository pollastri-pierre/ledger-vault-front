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
import Alert from './Alert';

import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      response: '',
      logout: false,
      sessionClosed: false,
      disabled: false,
      error: false,
      team: '',
      reroute: '/default',
    };
    if (props.location.state) {
      this.setState({ logou: props.location.state.logout , sessionClosed: props.location.state.sessionClosed });
      this.setState({ reroute: props.location.state.reroute });
    }
    console.log(props, this.state)
  }
 
  componentWillMount() {
    localStorage.setItem('email', this.props.match.params.email);
  }

  handleRequestClose = () => {
    this.setState({ logout: false, sessionClosed: false });
    localStorage.removeItem('loginout');
    localStorage.removeItem('sessionClosed');
  }

  render() {
    this.t = this.props.translate;
    let content = null;
    if ((!isEmpty(this.props.team)) && (this.props.team !== 'error')) {
      content = <DeviceLogin team={localStorage.team} reroute={this.state.reroute} />;
    } else {
      content = <TeamLogin team={localStorage.team} error={this.props.team === 'error'} />;
    }
    return (
      <div>
        <Alert
          onRequestClose={this.handleRequestClose}
          open={this.state.logout}
          theme="success"
          autoHideDuration={4000}
          title={this.t('login.logoutTitle')}
        >
          <div>{this.t('login.logoutMessage')}</div>
        </Alert>
        <Alert
          onRequestClose={this.handleRequestClose}
          open={this.state.sessionClosed}
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

Login.defaultProps = {
  reroute: '/',
  team: '',
};

Login.propTypes = {
  translate: React.PropTypes.func.isRequired,
  team: React.PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  return {
    reroute: state.setReroute.reroute,
    team: state.auth.team,
  };
}

export default withRouter(connect(mapStateToProps)(translate(Login)));
