//@flow
import React from "react";
import LineRow from "../../LineRow";
import type { Translate } from "data/types";
import { translate, Interpolate } from "react-i18next";
import {
  // BigSecurityTimeLockIcon,
  BigSecurityMembersIcon
  // BigSecurityRateLimiterIcon
} from "../../icons";
import BadgeSecurity from "../../BadgeSecurity";
import AccountName from "../../AccountName";
import InfoModal from "../../InfoModal";
// import RateLimiterValue from "../../RateLimiterValue";
// import TimeLockValue from "../../TimeLockValue";

function AccountCreationConfirmation(props: { account: Object, t: Translate }) {
  const {
    name,
    approvers,
    // rate_limiter,
    // time_lock,
    currency,
    quorum
  } = props.account;

  const { t } = props;

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${approvers.length} selected`}
        />
        {/* <BadgeSecurity */}
        {/*   icon={<BigSecurityTimeLockIcon />} */}
        {/*   label="Time-lock" */}
        {/*   disabled={!time_lock.enabled} */}
        {/*   value={ */}
        {/*     <TimeLockValue time_lock={time_lock.value * time_lock.frequency} /> */}
        {/*   } */}
        {/* /> */}
        {/* <BadgeSecurity */}
        {/*   icon={<BigSecurityRateLimiterIcon />} */}
        {/*   label="Rate Limiter" */}
        {/*   disabled={!rate_limiter.enabled} */}
        {/*   value={ */}
        {/*     <RateLimiterValue */}
        {/*       max_transaction={rate_limiter.value} */}
        {/*       time_slot={rate_limiter.frequency.value} */}
        {/*     /> */}
        {/*   } */}
        {/* /> */}
      </div>

      <div style={{ marginTop: "50px" }}>
        <LineRow label="account">
          <AccountName name={name} currency={currency} />
        </LineRow>
        <LineRow label="Currency">
          <span className="info-value currency">{currency.name}</span>
        </LineRow>
        <LineRow label={t("newAccount:confirmation.approvals")}>
          <Interpolate
            i18nKey="newAccount:confirmation.approvals_members"
            count={quorum}
            total={approvers.length}
          />
        </LineRow>
      </div>
      <div style={{ marginTop: "50px" }}>
        <InfoModal className="confirmation-explain">
          {t("newAccount:confirmation.desc")}
        </InfoModal>
      </div>
    </div>
  );
}

export default translate()(AccountCreationConfirmation);
