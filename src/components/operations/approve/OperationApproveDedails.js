//@flow
import React from "react";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import type { Operation, Account } from "../../../data/types";

const Approvals = ({ operation, account }) => {
  const quorum = account.security_scheme.quorum;
  const approved = operation.approved;
  const percentage = Math.round(100 * (approved / quorum));

  return <span>{`collecting approvals (${percentage}%)`}</span>;
};
function OperationApproveDetails(props: {
  operation: Operation,
  account: Account
}) {
  const { operation, account } = props;
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
          <strong>
            <Approvals operation={operation} account={account} />
          </strong>
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
