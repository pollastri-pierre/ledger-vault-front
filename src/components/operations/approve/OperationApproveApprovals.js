// @flow
import React from "react";
import type { Account, Operation } from "data/types";
import ApprovalList from "../../ApprovalList";

function OperationApproveApprovals(props: {
  account: Account,
  operation: Operation
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
