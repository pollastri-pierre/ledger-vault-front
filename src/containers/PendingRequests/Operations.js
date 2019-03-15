// @flow
import React, { Component } from "react";
import SpinnerCard from "components/spinners/SpinnerCard";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
// import QueuedOperationsQuery from "api/queries/QueuedOperationsQuery";
import Card from "components/legacy/Card";
import PendingOperationApprove from "components/pending/PendingOperationApprove";
import TryAgain from "components/TryAgain";
import type { Member, Account, Operation } from "data/types";

type Props = {
  approvers: Member[],
  operationsPending: Operation[],
  // operationsQueued: Operation[],
  accounts: Account[],
  user: Member,
};
class ApproveWatchOperations extends Component<Props> {
  render() {
    // we need to split between account already approved by current user and the other
    const {
      accounts,
      approvers,
      operationsPending,
      // operationsQueued,
      user,
    } = this.props;

    const toApprove = operationsPending.filter(
      operation =>
        !operation.approvals.find(
          approval => approval.person.pub_key === user.pub_key,
        ) && operation.status === "PENDING_APPROVAL",
    );
    const enhancedToApprove = toApprove.map(
      operation =>
        // operation.rate = { fiat: "USD", value: 10000 };
        operation,
    );

    // toWatch operations is the sum of operation already approved by user but not by total quorum + quued operation
    const toWatch = operationsPending.filter(
      operation =>
        operation.approvals.find(
          approval => approval.person.pub_key === user.pub_key,
        ) && operation.status === "PENDING_APPROVAL",
    );

    return (
      <div>
        <Card title={<Trans i18nKey="pending:operations.approve.title" />}>
          <PendingOperationApprove
            user={this.props.user}
            operations={enhancedToApprove}
            accounts={accounts}
            approvers={approvers}
          />
        </Card>
        <Card title={<Trans i18nKey="pending:operations.watch.title" />}>
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
    <Card title={<Trans i18nKey="pending:operations.approve.title" />}>
      <SpinnerCard />
    </Card>
    <Card title={<Trans i18nKey="pending:operations.watch.title" />}>
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
    approvers: UsersQuery,
    operationsPending: PendingOperationsQuery,
    // operationsQueued: QueuedOperationsQuery,
    accounts: AccountsQuery,
  },
  initialVariables: {
    approvers: 30,
  },
});
