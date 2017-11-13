//@flow
import React from "react";
import ApprovalList from "../../ApprovalList";
import type { Account, Operation, Member } from "../../../data/types";

function OperationApproveApprovals(props: {
  account: Account,
  operation: Operation,
  members: Array<Member>
}) {
  const { operation, members, account } = props;

  const approvers = [];
  account.security_scheme.approvers.forEach(approver => {
    const member = members.find(m => m.pub_key === approver);
    if (member) {
      approvers.push(member);
    }
  });
  const quorum = account.security_scheme.quorum;

  return (
    <ApprovalList
      approvers={approvers}
      approved={operation.approved}
      nbRequired={quorum}
    />
  );
}

export default OperationApproveApprovals;
