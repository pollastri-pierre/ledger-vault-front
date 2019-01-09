//@flow
import React from "react";
import { translate } from "react-i18next";
import Amount from "components/Amount";
import { BigSecurityMembersIcon } from "../../icons";

import BadgeSecurity from "../../BadgeSecurity";
import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import type { Account, Translate } from "data/types";

function AccountApproveDetails(props: {
  account: Account,
  t: Translate,
  quorum: number
}) {
  const { account, quorum, t } = props;
  const { security_scheme, currency } = account;
  const percentage = Math.round(100 * (account.approvals.length / quorum));
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px"
          // display: "flex",
          // flexDirection: "row"
        }}
      >
        <BadgeSecurity
          icon={<BigSecurityMembersIcon />}
          label="Members"
          value={`${account.members.length} selected`}
        />
      </div>
      <div>
        <LineRow label="balance" />
        <LineRow label="status">
          {percentage === 100 ? (
            <span data-test="status" className="info-value status">
              Approved
            </span>
          ) : (
            <span data-test="status" className="info-value status">
              Collecting approvals ({percentage}%)
            </span>
          )}
        </LineRow>
        <LineRow label="requested">
          <DateFormat date={account.created_on} dataTest="requested" />
        </LineRow>
        <LineRow label="name">
          <AccountName name={account.name} currencyId={currency.name} />
        </LineRow>
        <LineRow label="currency">
          <span data-test="currency" className="info-value currency">
            {currency.name}
          </span>
        </LineRow>
        <LineRow label={t("pendingAccount:details.approvals")}>
          {security_scheme.quorum} of {account.members.length} members
        </LineRow>
      </div>
    </div>
  );
}

export default translate()(AccountApproveDetails);
