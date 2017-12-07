//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import EntityApprove from "../../components/approve/EntityApprove";
import {
  PendingAccountApprove,
  PendingOperationApprove
} from "../../components";
import AccountsQuery from "../../api/queries/AccountsQuery";
import ModalRoute from "../../components/ModalRoute";
import ProfileQuery from "../../api/queries/ProfileQuery";
import PendingsQuery from "../../api/queries/PendingsQuery";
import ApproversQuery from "../../api/queries/ApproversQuery";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import TryAgain from "../../components/TryAgain";
import type { Account, Member } from "../../data/types";
import type { Response as PendingRequestsQueryResponse } from "../../api/queries/PendingsQuery";

const EntityApproveAccount = props => (
  <EntityApprove entity="account" {...props} />
);
const EntityApproveOperation = props => (
  <EntityApprove entity="operation" {...props} />
);

class PendingRequests extends Component<{
  accounts: Account[],
  pendingRequests: PendingRequestsQueryResponse,
  approversAccount: Member[],
  profile: Member
}> {
  render() {
    const { accounts, pendingRequests, approversAccount, profile } = this.props;

    return (
      <div className="pending-requests">
        <ModalRoute path="*/account/:id" component={EntityApproveAccount} />
        <ModalRoute path="*/operation/:id" component={EntityApproveOperation} />
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

const RenderError = ({ error, restlay }: *) => (
  <TryAgain error={error} action={restlay.forceFetch} />
);

const RenderLoading = () => (
  <div className="pending-requests">
    <div className="pending-left">
      <div className="bloc">
        <h3>Operations to approve</h3>
        <SpinnerCard />
      </div>
      <div className="bloc">
        <h3>Operations to watch</h3>
        <SpinnerCard />
      </div>
    </div>
    <div className="pending-right">
      <div className="bloc">
        <h3>Accounts to approve</h3>
        <SpinnerCard />
      </div>
      <div className="bloc">
        <h3>Accounts to watch</h3>
        <SpinnerCard />
      </div>
    </div>
  </div>
);

export default connectData(PendingRequests, {
  RenderError,
  RenderLoading,
  queries: {
    pendingRequests: PendingsQuery,
    accounts: AccountsQuery,
    profile: ProfileQuery,
    approversAccount: ApproversQuery
  }
});
