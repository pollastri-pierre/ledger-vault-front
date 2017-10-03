import React from 'react';
import { DialogButton } from '../';

function AccountCreationApprovals(props) {
  const { switchInternalModal, approvals, setApprovals, members } = props;
  return (
    <div className="account-creation-approvals">
      <header>
        <h3>Approvals</h3>
      </header>
      <div className="content">
        <input type="text" value={approvals} onChange={(e) => setApprovals(e.target.value)} />
        <label>Amount</label>
        <span className="count">approvals from {members.length} members</span>
        <p className="info">
          Approvals define the number of required signatures from the group
          of members allowed to approve outgoing operations.
        </p>
      </div>

      <div className="footer">
        <DialogButton right highlight onTouchTap={() => switchInternalModal('main')}>Done</DialogButton>
      </div>
    </div>
  );
}

export default AccountCreationApprovals;
