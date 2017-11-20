//@flow
import React, { Component } from "react";
import ApprovalStatus from "../ApprovalStatus";
import AccountName from "../AccountName";
import type { Account, Operation, Member } from "../../data/types";

class ApprovalStatusWithAccountName extends Component<{
  account: Account,
  operation: Operation,
  user: Member
}> {
  render() {
    const { operation, account, user } = this.props;
    return (
      <div>
        <ApprovalStatus
          approvingObject={operation}
          approved={operation.approved}
          approvers={account.security_scheme.approvers}
          nbRequired={account.security_scheme.quorum}
          user={user}
        />
        <AccountName name={account.name} currency={account.currency} />
      </div>
    );
  }
}

export default ApprovalStatusWithAccountName;
