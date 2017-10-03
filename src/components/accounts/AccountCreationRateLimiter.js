import React from 'react';
import { DialogButton } from '../';
import Checkbox from '../form/Checkbox';
import { PopBubble } from '../';
import ArrowDown from '../icons/ArrowDown';

function AccountCreationRateLimiter(props) {
  const {
    switchInternalModal,
    ratelimiter,
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
        <h3>Rate Limiter</h3>
      </header>
      <div className="content">
        <div className="form-field-checkbox" onClick={enable}>
          <label htmlFor="enable-ratelimiter">Enable</label>
          <Checkbox
            checked={ratelimiter.enabled}
            handleInputChange={enable}
            labelFor="enable-ratelimiter"
          />
        </div>
        <div className="form-field">
          <input className="medium-padding" type="text" id="text-duration" value={ratelimiter.rate} onChange={e => change(e.target.value)} />
          <label htmlFor="text-duration">Rate</label>
          <span className="count dropdown" onClick={(e) => openPopBubble(e.currentTarget)}>
            <strong>operation</strong> per {ratelimiter.frequency}
            <ArrowDown className="arrow-down" />
          </span>
          <PopBubble
            open={popbubble}
            onRequestClose={openPopBubble}
            anchorEl={anchor}
            style={{
              "marginLeft": "34px",
              "marginTop": "11px",
            }}
          >
            <div className="frequency-bubble">
              <div onClick={() => changeFrequency('rate-limiter', 'minut')} className="frequency-bubble-row">minuts</div>
              <div onClick={() => changeFrequency('rate-limiter', 'hour')} className="frequency-bubble-row">hours</div>
              <div onClick={() => changeFrequency('rate-limiter', 'day')} className="frequency-bubble-row">days</div>
            </div>
          </PopBubble>
        </div>
        <p className="info">
          Rate-limiter enforces that your team does not exceed a pre-defined
          number of outgoing transaction per interval of time.
        </p>
      </div>

      <div className="footer">
        <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
      </div>
    </div>
  );
}

export default AccountCreationRateLimiter;

