import React from 'react';
import PeopleThin from '../icons/PeopleThin';
import Hourglass from '../icons/Hourglass';
import Rates from '../icons/Rates';

function AccountCreationConfirmation(props) {
  const { security, options, currency } = props.account;

  return (
    <div>
      <div className="confirmation-security">
        <div className="confirmation-security-item">
          <PeopleThin className="security-icon member" />
          <span className="security-title">Members</span>
          <span className="security-value">
            {security.members.length} selected
          </span>
        </div>
        <div className={`confirmation-security-item ${(!security.timelock.enabled) ? 'disabled' : ''}`}>
          <Hourglass className="security-icon timelock" />
          <span className="security-title">Time-lock</span>
          <span className="security-value">
            {(security.timelock.enabled) ?
              <span>{security.timelock.duration} {security.timelock.frequency}</span>
            : 'disabled'}
          </span>
        </div>
        <div className={`confirmation-security-item ${(!security.ratelimiter.enabled) ? 'disabled' : ''}`}>
          <Rates className="security-icon ratelimiter" />
          <span className="security-title">Rate limiter</span>
          <span className="security-value">
            {(security.ratelimiter.enabled) ?
              <span>{security.ratelimiter.rate} per {security.ratelimiter.frequency}</span>
            : 'disabled'}
          </span>
        </div>
      </div>

      <div className="confirmation-infos">
        <div className="confirmation-info">
          <span className="info-title">Name</span>
          <span className="info-value name">{options.name}</span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Currency</span>
          <span className="info-value currency">{currency.name}</span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Approvals to spend</span>
          <span className="info-value">{security.approvals} of {security.members.length} members</span>
        </div>
      </div>
      <div className="confirmation-explain">
        A new account request will be created.
        The account will not be available until all the members
        in your team approve the creation request.
      </div>
    </div>
  );
}

export default AccountCreationConfirmation;
