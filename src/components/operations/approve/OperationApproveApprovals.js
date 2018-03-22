//@flow
import React from "react";
import ApprovalList from "../../ApprovalList";
import type { Account, Operation, Member } from "data/types";

function OperationApproveApprovals(props: {
  account: Account,
  operation: Operation,
  members: Array<Member>
}) {
  const { operation, account } = props;

  const quorum = account.security_scheme.quorum;

  return (
    <ApprovalList
      approvers={account.members}
      approved={operation.approvals}
      nbRequired={quorum}
    />
  );
}

export default OperationApproveApprovals;
