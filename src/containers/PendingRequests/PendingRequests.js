//@flow
import React, { Component } from "react";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";
import EntityApprove from "../../components/approve/EntityApprove";
import { Route } from "react-router";
import {
  PendingAccountApprove,
  PendingOperationApprove
} from "../../components";
import AccountsQuery from "../../api/queries/AccountsQuery";
import ProfileQuery from "../../api/queries/ProfileQuery";
import PendingsQuery from "../../api/queries/PendingsQuery";
import ApproversQuery from "../../api/queries/ApproversQuery";
import type { Account, Member } from "../../data/types";

import "./PendingRequests.css";

class PendingRequests extends Component<{
  accounts: Array<Account>,
  pendingRequests: *,
  approversAccount: Array<Member>,
  profile: Member
}> {
  render() {
    const { accounts, pendingRequests, approversAccount, profile } = this.props;

    return (
      <div className="pending-requests">
        <Route
          path="*/account/:id"
          render={() => <EntityApprove entity="account" />}
        />
        <Route
          path="*/operation/:id"
          render={() => <EntityApprove entity="operation" />}
        />
        <div className="pending-left">
          <div className="bloc">
            <h3>Operations to approve</h3>
            <PendingOperationApprove
              operations={pendingRequests.approveOperations}
              accounts={accounts}
              user={profile}
            />
          </div>
          <div className="bloc">
            <h3>Operations to watch</h3>
            <PendingOperationApprove
              operations={pendingRequests.watchOperations}
              approved
              user={profile}
              accounts={accounts}
            />
          </div>
        </div>
        <div className="pending-right">
          <div className="bloc">
            <h3>Accounts to approve</h3>
            <PendingAccountApprove
              accounts={pendingRequests.approveAccounts}
              approvers={approversAccount}
              user={profile}
            />
          </div>
          <div className="bloc">
            <h3>Accounts to watch</h3>
            <PendingAccountApprove
              accounts={pendingRequests.watchAccounts}
              approvers={approversAccount}
              user={profile}
              approved
            />
          </div>
        </div>
      </div>
    );
  }
}

export { PendingRequests as PendingRequestNotDecorated };

export default connectData(PendingRequests, {
  queries: {
    pendingRequests: PendingsQuery,
    accounts: AccountsQuery,
    profile: ProfileQuery,
    approversAccount: ApproversQuery
  },
  RenderLoading: SpinnerCard
});
