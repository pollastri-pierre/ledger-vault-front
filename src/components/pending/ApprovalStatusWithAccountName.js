//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import AccountQuery from "../../api/queries/AccountQuery";
import ApprovalStatus from "../ApprovalStatus";
import AccountName from "../AccountName";
import type { Account, Operation, Member } from "../../data/types";

class ApprovalStatusWithAccountName extends Component<{
  account: Account,
  user: Member,
  operation: Operation
}> {
  render() {
    const { operation, account, user } = this.props;
    return (
      <div>
        <ApprovalStatus
          approved={operation.approved}
          approvers={account.security_scheme.approvers}
          nbRequired={account.security_scheme.quorum}
          user_hash={user.pub_key}
        />
        <AccountName name={account.name} currency={account.currency} />
      </div>
    );
  }
}

export default connectData(ApprovalStatusWithAccountName, {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ operation }) => ({ accountId: operation.account_id })
});
