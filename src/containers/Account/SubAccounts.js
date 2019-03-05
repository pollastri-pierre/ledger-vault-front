// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";

import AccountsQuery from "api/queries/AccountsQuery";
import connectData from "restlay/connectData";

import { AccountsTable } from "components/Table";
import SpinnerCard from "components/spinners/SpinnerCard";
import Card from "components/legacy/Card";

import type { Account } from "data/types";

type Props = {
  accounts: Account[],
  account: Account,
  history: MemoryHistory
};

const RenderLoading = () => (
  <Card title={<Trans i18nKey="accountView:erc20_children" />}>
    <SpinnerCard />
  </Card>
);

class SubAccounts extends Component<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/account/${account.id}`);
  };

  render() {
    const { accounts, account } = this.props;
    const children = accounts.filter(a => a.parent_id === account.id);

    if (children.length === 0) {
      return null;
    }

    return (
      <Card title={<Trans i18nKey="accountView:erc20_children" />}>
        <AccountsTable data={children} onRowClick={this.handleAccountClick} />
      </Card>
    );
  }
}

export default connectData(withRouter(SubAccounts), {
  RenderLoading,
  queries: {
    accounts: AccountsQuery
  }
});
