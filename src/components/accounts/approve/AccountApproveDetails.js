//@flow
import React from "react";
import {
  BigSecurityTimeLockIcon,
  BigSecurityMembersIcon,
  BigSecurityRateLimiterIcon
} from "../../icons";

import RateLimiterValue from "../../RateLimiterValue";
import TimeLockValue from "../../TimeLockValue";
import BadgeSecurity from "../../BadgeSecurity";
import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import type { Account, Member } from "data/types";

function AccountApproveDetails(props: {
  account: Account,
  approvers: Member[]
}) {
  const { account, approvers } = props;
  const { security_scheme, currency } = account;
  const percentage = Math.round(
    100 * (account.approvals.length / approvers.length)
  );
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${account.members.length} selected`}
        />
        <BadgeSecurity
          icon={<BigSecurityTimeLockIcon />}
          label="Time-lock"
          disabled={!security_scheme.time_lock}
          value={<TimeLockValue time_lock={security_scheme.time_lock} />}
        />
        <BadgeSecurity
          icon={<BigSecurityRateLimiterIcon />}
          label="Rate Limiter"
          disabled={
            !security_scheme.rate_limiter ||
            !security_scheme.rate_limiter.max_transaction
          }
          value={
            security_scheme.rate_limiter && (
              <RateLimiterValue
                max_transaction={
                  security_scheme.rate_limiter &&
                  security_scheme.rate_limiter.max_transaction
                }
                time_slot={
                  security_scheme.rate_limiter &&
                  security_scheme.rate_limiter.time_slot
                }
              />
            )
          }
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
          <span className="info-value currency">{currency.units[1].name}</span>
        </LineRow>
        <LineRow label="Approvals to spend">
          {security_scheme.quorum} of {account.members.length} members
        </LineRow>
      </div>
    </div>
  );
}

export default AccountApproveDetails;
