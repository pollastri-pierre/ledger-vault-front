// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";

import AccountsQuery from "api/queries/AccountsQuery";
import connectData from "restlay/connectData";

import { AccountsTable } from "components/Table";
import SpinnerCard from "components/spinners/SpinnerCard";
import Card from "components/base/Card";
import { Label } from "components/base/form";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account } from "data/types";

type Props = {
  accounts: Connection<Account>,
  account: Account,
  history: MemoryHistory,
};

const RenderLoading = () => (
  <Card>
    <Label>
      <Trans i18nKey="accountView:erc20_children" />
    </Label>
    <SpinnerCard />
  </Card>
);

class SubAccounts extends Component<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/accounts/${account.id}`);
  };

  render() {
    const { accounts, account } = this.props;
    const children = accounts.edges
      .map(a => a.node)
      .filter(a => a.parent === account.id);

    if (children.length === 0) {
      return null;
    }

    return (
      <Card>
        <Label>
          <Trans i18nKey="accountView:erc20_children" />
        </Label>
        <AccountsTable data={children} onRowClick={this.handleAccountClick} />
      </Card>
    );
  }
}

export default connectData(withRouter(SubAccounts), {
  RenderLoading,
  queries: {
    accounts: AccountsQuery,
  },
});
