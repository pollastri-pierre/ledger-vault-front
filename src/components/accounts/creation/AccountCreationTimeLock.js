import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../form/Checkbox';
import { PopBubble, DialogButton } from '../../';
import ArrowDown from '../../icons/ArrowDown';

function AccountCreationTimeLock(props) {
  const {
    switchInternalModal,
    timelock,
    enable,
    popbubble,
    openPopBubble,
    anchor,
    change,
    changeFrequency,
  } = props;

  return (
    <div className="small-modal">
      <header>
        <h3>Time-lock</h3>
      </header>
      <div className="content">
        <div className="form-field-checkbox" onClick={enable} role="button" tabIndex={0}>
          <label htmlFor="enable-timelock">Enable</label>
          <Checkbox
            checked={timelock.enabled}
            handleInputChange={enable}
            labelFor="enable-timelock"
          />
        </div>
        <div className="form-field">
          <input className="small-padding" type="text" id="text-duration" value={timelock.duration} onChange={e => change(e.target.value)} />
          <label htmlFor="text-duration">Duration</label>
          <span className="count dropdown" role="button" tabIndex={0} onClick={e => openPopBubble(e.currentTarget)}>
            {timelock.frequency}
            <ArrowDown className="arrow-down" />
          </span>
          <PopBubble
            open={popbubble}
            onRequestClose={openPopBubble}
            anchorEl={anchor}
            style={{
              marginLeft: '34px',
              marginTop: '11px',
            }}
          >
            <div className="frequency-bubble">
              <div role="button" tabIndex={0} onClick={() => changeFrequency('timelock', 'minuts')} className={`frequency-bubble-row ${(timelock.frequency === 'minuts') ? 'active' : ''}`}>minuts</div>
              <div role="button" tabIndex={0} onClick={() => changeFrequency('timelock', 'hours')} className={`frequency-bubble-row ${(timelock.frequency === 'hours') ? 'active' : ''}`}>hours</div>
              <div role="button" tabIndex={0} onClick={() => changeFrequency('timelock', 'days')} className={`frequency-bubble-row ${(timelock.frequency === 'days') ? 'active' : ''}`}>days</div>
            </div>
          </PopBubble>
        </div>
        <p className="info">
          Time-lock delays each outgoing operation by
          a configurable length, after all the required members have given their
          approvals.
        </p>
      </div>

      <div className="footer">
        <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
      </div>
    </div>
  );
}

AccountCreationTimeLock.defaultProps = {
  anchor: {},
};

AccountCreationTimeLock.propTypes = {
  switchInternalModal: PropTypes.func.isRequired,
  timelock: PropTypes.shape({}).isRequired,
  popbubble: PropTypes.bool.isRequired,
  anchor: PropTypes.shape({}),
  enable: PropTypes.func.isRequired,
  openPopBubble: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  changeFrequency: PropTypes.func.isRequired,
};

export default AccountCreationTimeLock;
