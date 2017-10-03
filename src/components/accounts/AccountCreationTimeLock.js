import React from 'react';
import { DialogButton } from '../';
import Checkbox from '../form/Checkbox';

function AccountCreationTimeLock(props) {
  const { switchInternalModal, timelock, enable, change } = props;
  return (
    <div className="account-creation-approvals">
      <header>
        <h3>Time-lock</h3>
      </header>
      <div className="content">
        <div>
          <label>Enable</label>
          <Checkbox
            checked={timelock.enabled}
            handleInputChange={enable}
            labelFor="enable-timelock"
          />

        </div>
        <input type="text" value={timelock.duration} onChange={(e) => change(e.target.value)} />
        <label>Duration</label>
        <span className="count">hours</span>
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

export default AccountCreationTimeLock;
