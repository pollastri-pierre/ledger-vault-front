//@flow
import React from "react";
import LineRow from "../../LineRow";

import {
  BigSecurityTimeLockIcon,
  BigSecurityMembersIcon,
  BigSecurityRateLimiterIcon
} from "../../icons";
import BadgeSecurity from "../../BadgeSecurity";
import AccountName from "../../AccountName";
import InfoModal from "../../InfoModal";
import RateLimiterValue from "../../RateLimiterValue";
import TimeLockValue from "../../TimeLockValue";

function AccountCreationConfirmation(props: { account: Object }) {
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
      <div style={{ textAlign: "center" }}>
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${approvers.length} selected`}
        />
        <BadgeSecurity
          icon={<BigSecurityTimeLockIcon />}
          label="Time-lock"
          disabled={!time_lock.enabled}
          value={
            <TimeLockValue
              time_lock={time_lock.value * time_lock.frequency.value}
            />
          }
        />
        <BadgeSecurity
          icon={<BigSecurityRateLimiterIcon />}
          label="Rate Limiter"
          disabled={!rate_limiter.enabled}
          value={
            <RateLimiterValue
              max_transaction={rate_limiter.value}
              time_slot={rate_limiter.frequency.value}
            />
          }
        />
      </div>

      <div style={{ marginTop: "50px" }}>
        <LineRow label="account">
          <AccountName name={name} currency={currency} />
        </LineRow>
        <LineRow label="Currency">
          <span className="info-value currency">{currency.units[0].name}</span>
        </LineRow>
        <LineRow label="Approvals to speend">
          {quorum} of {approvers.length} members
        </LineRow>
      </div>
      <div style={{ marginTop: "50px" }}>
        <InfoModal className="confirmation-explain">
          A new account request will be created. The account will not be
          available until all the members in your team approve the creation
          request.
        </InfoModal>
      </div>
    </div>
  );
}

export default AccountCreationConfirmation;
