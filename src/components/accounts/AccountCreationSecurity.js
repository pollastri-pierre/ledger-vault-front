import React from 'react';
import './AccountCreationSecurity.css';

import Rates from '../icons/Rates';
import People from '../icons/People';
import Hourglass from '../icons/Hourglass';
import ValidateBadge from '../icons/ValidateBadge';
import ArrowDown from '../icons/ArrowDown';

function AccountCreationSecurity(props) {
  const { account, switchInternalModal } = props;
  return (
    <div className="account-creation-security">
      <h4>Security Scheme</h4>
      <h5>Members</h5>
      <div className="security-members">
        <div className="security-scheme-line" onClick={() => switchInternalModal('members')}>
          <People className="security-icon security-icon-members" />
          <span className="security-scheme-name">Members</span>
          <span className="security-scheme-value">{account.security.members.length} selected
            <ArrowDown className="security-arrow-right" />
          </span>
        </div>
        <div className="security-scheme-hr" />
        {(account.security.members.length === 0) ?
          <div className="security-scheme-line disabled">
            <ValidateBadge className="security-icon security-icon-approvals" />
            <span className="security-scheme-name">Approvals</span>
            <span className="security-scheme-value">3 required
              <ArrowDown className="security-arrow-right" />
            </span>
          </div>
          :
          <div
            className={`security-scheme-line ${(account.security.approvals > account.security.members.length) ? 'error' : ''}`}
            onClick={() => switchInternalModal('approvals')}
          >
            <ValidateBadge className="security-icon security-icon-approvals" />
            <span className="security-scheme-name">Approvals</span>
            <span className="security-scheme-value">{account.security.approvals} required
              <ArrowDown className="security-arrow-right" />
            </span>
          </div>

        }
      </div>
      <h5>Locks</h5>
      <div className="security-members">
        <div className="security-scheme-line" onClick={() => switchInternalModal('time-lock')}>
          <Hourglass className="security-icon security-icon-time-lock" />
          <span className="security-scheme-name">Time-Lock</span>
          <span className="security-scheme-value">24 hours
            <ArrowDown className="security-arrow-right" />
          </span>
        </div>
        <div className="security-scheme-hr" />
        <div className="security-scheme-line">
          <Rates className="security-icon security-icon-rate-limiter" />
          <span className="security-scheme-name">Rate Limiter</span>
          <span className="security-scheme-value">72 jours
            <ArrowDown className="security-arrow-right" />
          </span>
        </div>
      </div>
    </div>

  );
}


export default AccountCreationSecurity;
