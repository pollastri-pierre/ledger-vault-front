import React from "react";
import PropTypes from "prop-types";

import Rates from "../../icons/thin/Rates";
import PeopleThin from "../../icons/thin/People";
import Hourglass from "../../icons/thin/Hourglass";
import AccountName from "../../AccountName";

function AccountCreationConfirmation(props) {
  const {
    name,
    approvers,
    rate_limiter,
    time_lock,
    currency,
    quorum
  } = props.account;

  return (
    <div>
      <div className="confirmation-security">
        <div className="confirmation-security-item">
          <PeopleThin className="security-icon member" />
          <span className="security-title">Members</span>
          <span className="security-value">{approvers.length} selected</span>
        </div>
        <div
          className={`confirmation-security-item ${
            !time_lock.enabled ? "disabled" : ""
          }`}
        >
          <Hourglass className="security-icon timelock" />
          <span className="security-title">Time-lock</span>
          <span className="security-value">
            {time_lock.enabled ? (
              <span>
                {time_lock.value} {time_lock.frequency}
              </span>
            ) : (
              "disabled"
            )}
          </span>
        </div>
        <div
          className={`confirmation-security-item ${
            !rate_limiter.enabled ? "disabled" : ""
          }`}
        >
          <Rates className="security-icon ratelimiter" />
          <span className="security-title">Rate limiter</span>
          <span className="security-value">
            {rate_limiter.enabled ? (
              <span>
                {rate_limiter.value} per {rate_limiter.frequency}
              </span>
            ) : (
              "disabled"
            )}
          </span>
        </div>
      </div>

      <div className="confirmation-infos">
        <div className="confirmation-info">
          <span className="info-title">Name</span>
          <span className="info-value name">
            <AccountName name={name} currency={currency} />
          </span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Currency</span>
          <span className="info-value currency">{currency.units[0].name}</span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Approvals to spend</span>
          <span className="info-value">
            {quorum} of {approvers.length} members
          </span>
        </div>
      </div>
      <div className="confirmation-explain">
        A new account request will be created. The account will not be available
        until all the members in your team approve the creation request.
      </div>
    </div>
  );
}

AccountCreationConfirmation.propTypes = {
  account: PropTypes.shape({}).isRequired
};

export default AccountCreationConfirmation;
