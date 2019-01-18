// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { Operation, Account, Member } from "data/types";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import ApprovalStatus from "../../ApprovalStatus";

function OperationApproveDetails(props: {
  operation: Operation,
  account: Account,
  profile: Member
}) {
  const { operation, account, profile } = props;

  return (
    <div>
      <OverviewOperation
        amount={operation.price.amount}
        account={account}
        operationType={operation.type}
      />
      <div className="operation-list">
        <LineRow label={<Trans i18nKey="newOperation:details.identifier" />}>
          {operation.recipient && <span>{operation.recipient}</span>}
        </LineRow>
        <LineRow label={<Trans i18nKey="newOperation:details.status" />}>
          <ApprovalStatus
            approvingObject={operation}
            approved={operation.approvals}
            approvers={account.members}
            nbRequired={account.security_scheme.quorum}
            user={profile}
          />
        </LineRow>
        <LineRow label={<Trans i18nKey="newOperation:details.date" />}>
          <DateFormat date={operation.created_on} />
        </LineRow>
        <LineRow label={<Trans i18nKey="newOperation:details.account" />}>
          <AccountName name={account.name} currencyId={account.currency_id} />
        </LineRow>
        {/* <LineRow label="Confirmation fees"> */}
        {/*   <Amount account={account} value={operation.fees.amount} /> */}
        {/* </LineRow> */}
        <LineRow label={<Trans i18nKey="newOperation:details.total" />}>
          <Amount account={account} value={operation.price.amount} strong />
        </LineRow>
      </div>
    </div>
  );
}

export default OperationApproveDetails;
