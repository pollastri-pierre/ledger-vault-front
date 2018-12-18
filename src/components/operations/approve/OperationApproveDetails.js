//@flow
import React from "react";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import ApprovalStatus from "../../ApprovalStatus";
import type { Operation, Account, Member } from "data/types";

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
        <LineRow label="Identifier">
          {operation.recipient && <span>{operation.recipient}</span>}
        </LineRow>
        <LineRow label="status">
          <ApprovalStatus
            approvingObject={operation}
            approved={operation.approvals}
            approvers={account.members}
            nbRequired={account.security_scheme.quorum}
            user={profile}
          />
        </LineRow>
        <LineRow label="requested">
          <DateFormat date={operation.created_on} />
        </LineRow>
        <LineRow label="account to debit">
          <AccountName name={account.name} currencyId={account.currency.name} />
        </LineRow>
        {/* <LineRow label="Confirmation fees"> */}
        {/*   <Amount account={account} value={operation.fees.amount} /> */}
        {/* </LineRow> */}
        <LineRow label="Total Spent">
          <Amount account={account} value={operation.price.amount} strong />
        </LineRow>
      </div>
    </div>
  );
}

export default OperationApproveDetails;
