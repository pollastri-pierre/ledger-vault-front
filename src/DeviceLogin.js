import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setTeam, loginU2f } from './actions';
//import TextField from 'material-ui/TextField';
import DialogButton from './DialogButton';
import translate from './translate';


class DeviceLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      response: '',
      snackOpen: false,
      dialogOpen: false,
    };
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    this.props.loginU2f(global.u2f, this.redirect);
  }


  redirect = () => {
    this.props.history.push(localStorage.reroute);
  }

  back(e) {
    this.props.setTeam('');
  }

  render() {
    console.log(this);
    this.t = this.props.translate;
    return (
      <div className="DeviceLogin">
        <img className="dongle" src="img/logo.png" alt="Dongle" />
        <br/>
        <div className="team">
          {this.t('login.signIn', { team: this.props.team })}
        </div>
        <div className="spacer" />
        <div className="instructions" >
          <div className="item">
            <div className="bullet">1.</div>
            <div className="step">{this.t('login.stepOne')}</div>
          </div>
          <div className="item">
            <div className="bullet">2.</div>
            <div className="step">{this.t('login.stepTwo')}</div>
          </div>
          <div className="item">
            <div className="bullet">3.</div>
            <div className="step">{this.t('login.stepThree')}</div>
          </div>
        </div>
        <DialogButton onTouchTap={this.back}>{this.t('common.cancel')}</DialogButton>
        <div className="wait">{this.t('login.awaitingDevice')}</div>
      </div>
    );
  }
}

DeviceLogin.propTypes = {
  translate: React.PropTypes.func.isRequired,
  loginU2f: React.PropTypes.func.isRequired,
  team: React.PropTypes.string.isRequired,
  setTeam: React.PropTypes.func.isRequired,
  history: React.PropTypes.object.isRequired,
};

export default withRouter(connect(null, { setTeam, loginU2f })(translate(DeviceLogin)));
