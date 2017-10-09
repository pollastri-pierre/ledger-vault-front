import React from 'react';
import PropTypes from 'prop-types';
import './AccountCreationSecurity.css';

import Rates from '../../icons/Rates';
import People from '../../icons/People';
import Hourglass from '../../icons/Hourglass';
import ValidateBadge from '../../icons/ValidateBadge';
import ArrowDown from '../../icons/ArrowDown';

function AccountCreationSecurity(props) {
  const { account, switchInternalModal } = props;
  return (
    <div className="account-creation-security">
      <h4>Security Scheme</h4>
      <h5>Members</h5>
      <div className="security-members">
        <div className="security-scheme-line" onClick={() => switchInternalModal('members')} role="button" tabIndex={0}>
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
            <span className="security-scheme-value">
              {account.security.approvals} required
              <ArrowDown className="security-arrow-right" />
            </span>
          </div>
          :
          <div
            className={`security-scheme-line ${(account.security.approvals > account.security.members.length) ? 'error' : ''}`}
            onClick={() => switchInternalModal('approvals')}
            role="button"
            tabIndex={0}
          >
            <ValidateBadge className="security-icon security-icon-approvals" />
            <span className="security-scheme-name">Approvals</span>
            <span className="security-scheme-value">
              {account.security.approvals} required
              <ArrowDown className="security-arrow-right" />
            </span>
          </div>

        }
      </div>
      <h5>Locks</h5>
      <div className="security-members">
        <div className="security-scheme-line" onClick={() => switchInternalModal('time-lock')} role="button" tabIndex={0}>
          <Hourglass className="security-icon security-icon-time-lock" />
          <span className="security-scheme-name">Time-Lock</span>
          <span className="security-scheme-value">
            {(account.security.timelock.enabled) ?
              <span>
                {account.security.timelock.duration} {account.security.timelock.frequency}
              </span>
              : 'disabled'
            }
            <ArrowDown className="security-arrow-right" />
          </span>
        </div>
        <div className="security-scheme-hr" />
        <div className="security-scheme-line" onClick={() => switchInternalModal('rate-limiter')} role="button" tabIndex={0}>
          <Rates className="security-icon security-icon-rate-limiter" />
          <span className="security-scheme-name">Rate Limiter</span>
          <span className="security-scheme-value">
            {(account.security.ratelimiter.enabled) ?
              <span>
                {account.security.ratelimiter.rate} per {account.security.ratelimiter.frequency}
              </span>
              : 'disabled'
            }
            <ArrowDown className="security-arrow-right" />
          </span>
        </div>
      </div>
    </div>

  );
}


AccountCreationSecurity.propTypes = {
  switchInternalModal: PropTypes.func.isRequired,
  account: PropTypes.shape({}).isRequired,
};

export default AccountCreationSecurity;
