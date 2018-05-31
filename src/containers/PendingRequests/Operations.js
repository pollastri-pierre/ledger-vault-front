//@flow
import React, { Component } from "react";
import SpinnerCard from "components/spinners/SpinnerCard";
import connectData from "restlay/connectData";
import MembersQuery from "api/queries/MembersQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
// import QueuedOperationsQuery from "api/queries/QueuedOperationsQuery";
import Card from "components/Card";
import { PendingOperationApprove } from "components";
import TryAgain from "components/TryAgain";
import type { Member, Account, Operation } from "data/types";

type Props = {
  approvers: Member[],
  operationsPending: Operation[],
  // operationsQueued: Operation[],
  accounts: Account[],
  user: Member
};
class ApproveWatchOperations extends Component<Props> {
  render() {
    // we need to split between account already approved by current user and the other
    const {
      accounts,
      approvers,
      operationsPending,
      // operationsQueued,
      user
    } = this.props;

    const toApprove = operationsPending.filter(
      operation =>
        !operation.approvals.find(
          approval => approval.person.pub_key === user.pub_key
        ) && operation.status === "PENDING_APPROVAL"
    );
    const enhancedToApprove = toApprove.map(operation => {
      // operation.rate = { fiat: "USD", value: 10000 };
      return operation;
    });

    // toWatch operations is the sum of operation already approved by user but not by total quorum + quued operation
    const toWatch = operationsPending.filter(
      operation =>
        operation.approvals.find(
          approval => approval.person.pub_key === user.pub_key
        ) && operation.status === "PENDING_APPROVAL"
    );

    return (
      <div>
        <Card title="Operations to approve">
          <PendingOperationApprove
            user={this.props.user}
            operations={enhancedToApprove}
            accounts={accounts}
            approvers={approvers}
          />
        </Card>
        <Card title="Operations to watch">
          <PendingOperationApprove
            user={this.props.user}
            operations={toWatch}
            accounts={accounts}
            approvers={approvers}
            approved
          />
        </Card>
      </div>
    );
  }
}

const RenderLoading = () => (
  <div>
    <Card title="Operations to approve">
      <SpinnerCard />
    </Card>
    <Card title="Operations to watch">
      <SpinnerCard />
    </Card>
  </div>
);
const RenderError = ({ error, restlay }: *) => (
  <Card>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);
export default connectData(ApproveWatchOperations, {
  RenderLoading,
  RenderError,
  queries: {
    approvers: MembersQuery,
    operationsPending: PendingOperationsQuery,
    // operationsQueued: QueuedOperationsQuery,
    accounts: AccountsQuery,
    currencies: CurrenciesQuery
  }
});
