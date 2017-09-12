import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DialogButton } from '../../components';
import translate from '../../decorators/Translate';


class DeviceLogin extends Component {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
  }

  back() {
    this.props.onCancel();
  }

  render() {
    this.t = this.props.translate;
    return (
      <div className="DeviceLogin">
        <img className="dongle" src="img/logo.png" alt="Dongle" />
        <br />
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
  translate: PropTypes.func.isRequired,
  team: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default translate(DeviceLogin);
