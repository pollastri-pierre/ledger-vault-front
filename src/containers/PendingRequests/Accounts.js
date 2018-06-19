//@flow
import React, { Component } from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import SpinnerCard from "components/spinners/SpinnerCard";
import connectData from "restlay/connectData";
import MembersQuery from "api/queries/MembersQuery";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import Card from "components/Card";
import { PendingAccountApprove } from "components";
import TryAgain from "components/TryAgain";
import type { Member, Account } from "data/types";

type Props = {
  approvers: Member[],
  organization: *,
  accounts: Account[],
  t: Translate,
  user: Member
};
class ApproveWatchAccounts extends Component<Props> {
  render() {
    // we need to split between account already approved by current user and the other
    const { accounts, approvers, user, organization, t } = this.props;

    const toApprove = accounts.filter(
      account =>
        !account.approvals.find(
          approval => approval.person.pub_key === user.pub_key
        )
    );

    const toWatch = accounts.filter(account =>
      account.approvals.find(
        approval => approval.person.pub_key === user.pub_key
      )
    );

    return (
      <div>
        <Card title={t("pending:accounts.approve.title")}>
          <PendingAccountApprove
            user={this.props.user}
            accounts={toApprove}
            approvers={approvers}
            quorum={organization.quorum}
          />
        </Card>
        <Card title={t("pending:accounts.watch.title")}>
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

const RenderLoading = translate()(({ t }, { t: Translate }) => (
  <div>
    <Card title={t("pending:accounts.approve.title")}>
      <SpinnerCard />
    </Card>
    <Card title={t("pending:accounts.watch.title")}>
      <SpinnerCard />
    </Card>
  </div>
));
const RenderError = ({ error, restlay }: *) => (
  <Card>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);
export default connectData(translate()(ApproveWatchAccounts), {
  RenderLoading,
  RenderError,
  queries: {
    approvers: MembersQuery,
    accounts: PendingAccountsQuery,
    currencies: CurrenciesQuery,
    organization: OrganizationQuery
  }
});
