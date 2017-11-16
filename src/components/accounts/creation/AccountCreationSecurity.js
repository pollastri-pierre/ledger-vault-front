//@flow
import React from "react";
import "./AccountCreationSecurity.css";
import RateLimiterValue from "../../RateLimiterValue";
import TimeLockValue from "../../TimeLockValue";
import SecurityRow from "../../SecurityRow";
import {
  SecurityMembersIcon,
  SecurityQuorumIcon,
  SecurityRateLimiterIcon,
  SecurityTimelockIcon
} from "../../icons";

function AccountCreationSecurity(props: {
  account: Object,
  switchInternalModal: Function
}) {
  const { account, switchInternalModal } = props;
  console.log(account.time_lock);
  return (
    <div className="account-creation-security">
      <h4>Security Scheme</h4>
      <h5>Members</h5>
      <div className="security-members">
        <SecurityRow
          icon={<SecurityMembersIcon />}
          label="Members"
          onClick={() => switchInternalModal("members")}
        >
          {account.approvers.length} selected
        </SecurityRow>
        <SecurityRow
          icon={<SecurityQuorumIcon />}
          label="Approvals"
          disabled={account.approvers.length === 0}
          onClick={() => switchInternalModal("approvals")}
        >
          {account.quorum} required
        </SecurityRow>
      </div>
      <h5>Locks</h5>
      <SecurityRow
        icon={<SecurityTimelockIcon />}
        label="Time-lock"
        onClick={() => switchInternalModal("time-lock")}
      >
        {account.time_lock.enabled ? (
          <TimeLockValue
            time_lock={
              account.time_lock.value * account.time_lock.frequency.value
            }
          />
        ) : (
          "disabled"
        )}
      </SecurityRow>
      <SecurityRow
        icon={<SecurityRateLimiterIcon />}
        label="Rate Limiter"
        onClick={() => switchInternalModal("rate-limiter")}
      >
        {account.rate_limiter.enabled ? (
          <RateLimiterValue
            max_transaction={account.rate_limiter.value}
            time_slot={account.rate_limiter.frequency.value}
          />
        ) : (
          "disabled"
        )}
      </SecurityRow>
    </div>
  );
}

export default AccountCreationSecurity;
