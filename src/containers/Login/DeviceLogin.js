import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DialogButton } from '../../components';
import Plug from '../../components/icons/thin/Plug';
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
    const t = this.context.translate;
    return (
      <div className="DeviceLogin">
        <Plug className="dongle" fill="#e2e2e2"/>
        <br />
        <div className="team">
          {t('login.signIn', { team: this.props.team })}
        </div>
        <div className="spacer" />
        <div className="instructions" >
          <div className="item">
            <div className="bullet">1.</div>
            <div className="step">{t('login.stepOne')}</div>
          </div>
          <div className="item">
            <div className="bullet">2.</div>
            <div className="step">{t('login.stepTwo')}</div>
          </div>
          <div className="item">
            <div className="bullet">3.</div>
            <div className="step">{t('login.stepThree')}</div>
          </div>
        </div>
        <DialogButton onTouchTap={this.back}>{t('common.cancel')}</DialogButton>
        <div className="wait">{t('login.awaitingDevice')}</div>
      </div>
    );
  }
}

DeviceLogin.propTypes = {
  team: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

DeviceLogin.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default translate(DeviceLogin);
