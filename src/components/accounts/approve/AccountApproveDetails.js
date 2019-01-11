//@flow
import React from "react";
import { translate } from "react-i18next";
import { BigSecurityMembersIcon } from "../../icons";

import BadgeSecurity from "../../BadgeSecurity";
import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import { getAccountCurrencyName } from "utils/accounts";
import type { Account, Translate } from "data/types";

type Props = {
  account: Account,
  t: Translate,
  quorum: number
};

function AccountApproveDetails(props: Props) {
  const { account, quorum, t } = props;
  const { security_scheme } = account;
  const percentage = quorum
    ? Math.round(100 * (account.approvals.length / quorum))
    : 0;
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
          <AccountName account={account} />
        </LineRow>
        <LineRow label="currency">
          <span data-test="currency" className="info-value currency">
            {getAccountCurrencyName(account)}
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
