// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import SpinnerCard from "components/spinners/SpinnerCard";
import connectData from "restlay/connectData";
import UsersQuery from "api/queries/UsersQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import Card from "components/legacy/Card";
import PendingAccountApprove from "components/pending/PendingAccountApprove";
import TryAgain from "components/TryAgain";
import type { User, Account } from "data/types";

type Props = {
  approvers: User[],
  organization: *,
  accounts: Account[],
  user: User,
};
class ApproveWatchAccounts extends Component<Props> {
  render() {
    // we need to split between account already approved by current user and the other
    const { accounts, approvers, user, organization } = this.props;

    const toApprove = accounts.filter(
      account =>
        !account.approvals.find(
          approval => approval.person.pub_key === user.pub_key,
        ),
    );

    const toWatch = accounts.filter(account =>
      account.approvals.find(
        approval => approval.person.pub_key === user.pub_key,
      ),
    );

    return (
      <div>
        <Card title={<Trans i18nKey="pending:accounts.approve.title" />}>
          <PendingAccountApprove
            user={this.props.user}
            accounts={toApprove}
            approvers={approvers}
            quorum={organization.quorum}
          />
        </Card>
        <Card title={<Trans i18nKey="pending:accounts.watch.title" />}>
          <PendingAccountApprove
            user={this.props.user}
            accounts={toWatch}
            approvers={approvers}
            quorum={organization.quorum}
            approved
          />
        </Card>
      </div>
    );
  }
}

const RenderLoading = () => (
  <div>
    <Card title={<Trans i18nKey="pending:accounts.approve.title" />}>
      <SpinnerCard />
    </Card>
    <Card title={<Trans i18nKey="pending:accounts.watch.title" />}>
      <SpinnerCard />
    </Card>
  </div>
);
const RenderError = ({ error, restlay }: *) => (
  <Card>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);
export default connectData(ApproveWatchAccounts, {
  RenderLoading,
  RenderError,
  queries: {
    approvers: UsersQuery,
    accounts: PendingAccountsQuery,
    organization: OrganizationQuery,
  },
  initialVariables: {
    approvers: 30,
  },
});
