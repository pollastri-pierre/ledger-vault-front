import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import {
  BigSecurityTimeLockIcon,
  BigSecurityMembersIcon,
  BigSecurityRateLimiterIcon
} from "../../icons";

import BadgeSecurity from "../../BadgeSecurity";
import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";

function AccountApproveDetails(props) {
  const { security_scheme, currency, approved } = props.account;
  const { account } = props;
  const { approvers } = props;

  const percentage = Math.round(100 * (approved.length / approvers.length));

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${security_scheme.approvers.length} selected`}
        />
        <BadgeSecurity
          icon={<BigSecurityTimeLockIcon />}
          label="Time-lock"
          disabled={_.isNull(security_scheme.time_lock)}
          value={`${_.isNull(security_scheme.time_lock)
            ? "disabled"
            : security_scheme.time_lock}`}
        />
        <BadgeSecurity
          icon={<BigSecurityRateLimiterIcon />}
          label="Rate Limiter"
          disabled={_.isNull(security_scheme.rate_limiter)}
          value={`${_.isNull(security_scheme.rate_limiter)
            ? "disabled"
            : security_scheme.rate_limiter.max_transaction +
              " per " +
              security_scheme.rate_limiter.time_slot}`}
        />
      </div>
      <div>
        <LineRow label="status">
          {percentage === 100 ? (
            <span className="info-value status">Approved</span>
          ) : (
            <span className="info-value status">
              Collecting approvals ({percentage}%)
            </span>
          )}
        </LineRow>
        <LineRow label="requested">
          <DateFormat date={account.creation_time} />
        </LineRow>
        <LineRow label="name">
          <AccountName name={account.name} currency={currency} />
        </LineRow>
        <LineRow label="currency">
          <span className="info-value currency">{currency.units[0].name}</span>
        </LineRow>
        <LineRow label="Approvals to spend">
          {security_scheme.quorum} of {security_scheme.approvers.length} members
        </LineRow>
      </div>
    </div>
  );
}

AccountApproveDetails.propTypes = {
  account: PropTypes.shape({}).isRequired
};

export default AccountApproveDetails;
