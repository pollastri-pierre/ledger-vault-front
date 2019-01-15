// @flow

import React from "react";
import { translate } from "react-i18next";
import Amount from "components/Amount";
import { getAccountCurrencyName } from "utils/accounts";
import type { Account, Translate } from "data/types";
import { BigSecurityMembersIcon } from "../../icons";

import BadgeSecurity from "../../BadgeSecurity";
import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";

const membersIcon = <BigSecurityMembersIcon />;

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

  const badgeVal = `${account.members.length} selected`;

  const status =
    percentage === 100 ? (
      <span data-test="status" className="info-value status">
        {"Approved"}
      </span>
    ) : (
      <span data-test="status" className="info-value status">
        {`Collecting approvals (${percentage}%)`}
      </span>
    );

  const approvals = `${security_scheme.quorum} of ${
    account.members.length
  } members`;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <BadgeSecurity icon={membersIcon} label="Members" value={badgeVal} />
      </div>
      <div>
        <LineRow label="balance">
          <Amount
            account={account}
            value={account.balance}
            strong
            dataTest="balance"
            erc20Format={account.account_type === "ERC20"}
          />
        </LineRow>
        <LineRow label="status">{status}</LineRow>
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
          {approvals}
        </LineRow>
      </div>
    </div>
  );
}

export default translate()(AccountApproveDetails);
