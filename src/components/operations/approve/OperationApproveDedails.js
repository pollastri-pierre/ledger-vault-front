//@flow
import React from "react";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import ApprovalStatus from "../../ApprovalStatus";
import type { Operation, Account, Member } from "../../../data/types";

function OperationApproveDetails(props: {
  operation: Operation,
  account: Account,
  profile: Member
}) {
  const { operation, account, profile } = props;
  const { rate } = operation;

  return (
    <div>
      <OverviewOperation
        hash="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"
        amount={operation.amount}
        account={account}
        rate={rate}
      />
      <div className="operation-list">
        <LineRow label="status">
          <ApprovalStatus
            approvingObject={operation}
            approved={operation.approved}
            approvers={account.security_scheme.approvers}
            nbRequired={account.security_scheme.quorum}
            user={profile}
          />
        </LineRow>
        <LineRow label="requested">
          <DateFormat date={operation.time} />
        </LineRow>
        <LineRow label="account to debit">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="Confirmation fees">
          <Amount account={account} value={operation.fees} rate={rate} />
        </LineRow>
        <LineRow label="Total Spent">
          <Amount
            account={account}
            value={operation.amount}
            rate={rate}
            strong
          />
        </LineRow>
      </div>
    </div>
  );
}

export default OperationApproveDetails;
