import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Rates from "../../icons/thin/Rates";
import PeopleThin from "../../icons/thin/People";
import Hourglass from "../../icons/thin/Hourglass";
import DateFormat from "../../DateFormat";
import AccountName from "../../AccountName";

function AccountApproveDetails(props) {
  const { security_scheme, currency, approved } = props.account;
  const { account } = props;
  const { approvers } = props;

  const percentage = Math.round(100 * (approved.length / approvers.length));

  return (
    <div>
      <div className="confirmation-security">
        <div className="confirmation-security-item">
          <PeopleThin className="security-icon member" />
          <span className="security-title">Members</span>
          <span className="security-value">
            {security_scheme.approvers.length} selected
          </span>
        </div>
        <div
          className={`confirmation-security-item ${
            _.isNull(security_scheme.time_lock) ? "disabled" : ""
          }`}
        >
          <Hourglass className="security-icon timelock" />
          <span className="security-title">Time-lock</span>
          <span className="security-value">
            {!_.isNull(security_scheme.time_lock) ? (
              <span>{security_scheme.time_lock}</span>
            ) : (
              "disabled"
            )}
          </span>
        </div>
        <div
          className={`confirmation-security-item ${
            _.isNull(security_scheme.rate_limiter) ? "disabled" : ""
          }`}
        >
          <Rates className="security-icon ratelimiter" />
          <span className="security-title">Rate limiter</span>
          <span className="security-value">
            {!_.isNull(security_scheme.rate_limiter) ? (
              <span>
                {security_scheme.rate_limiter.max_transaction} per{" "}
                {security_scheme.rate_limiter.time_slot}
              </span>
            ) : (
              "disabled"
            )}
          </span>
        </div>
      </div>

      <div className="confirmation-infos">
        <div className="confirmation-info">
          <span className="info-title">Status</span>
          {percentage === 100 ? (
            <span className="info-value status">Approved</span>
          ) : (
            <span className="info-value status">
              Collecting approvals ({percentage}%)
            </span>
          )}
        </div>
        <div className="confirmation-info">
          <span className="info-title">Requested</span>
          <span className="info-value date">
            <DateFormat date={account.creation_time} />
          </span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Name</span>
          <span className="info-value name">
            <AccountName name={account.name} currency={currency} />
          </span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Currency</span>
          <span className="info-value currency">{currency.units[0].name}</span>
        </div>
        <div className="confirmation-info">
          <span className="info-title">Approvals to spend</span>
          <span className="info-value">
            {security_scheme.quorum} of {security_scheme.approvers.length}{" "}
            members
          </span>
        </div>
      </div>
    </div>
  );
}

AccountApproveDetails.propTypes = {
  account: PropTypes.shape({}).isRequired
};

export default AccountApproveDetails;
