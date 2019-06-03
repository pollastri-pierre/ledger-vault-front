// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";

import AccountsQuery from "api/queries/AccountsQuery";
import connectData from "restlay/connectData";

import { withMe } from "components/UserContextProvider";
import { AccountsTable } from "components/Table";
import SpinnerCard from "components/spinners/SpinnerCard";
import Card from "components/base/Card";
import { Label } from "components/base/form";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account, User } from "data/types";

type Props = {
  accounts: Connection<Account>,
  account: Account,
  history: MemoryHistory,
  me: User,
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
    const { me } = this.props;
    const orgaName = location.pathname.split("/")[1];
    const role = me.role.toLowerCase();
    this.props.history.push(`/${orgaName}/${role}/accounts/view/${account.id}`);
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

export default connectData(withRouter(withMe(SubAccounts)), {
  RenderLoading,
  queries: {
    accounts: AccountsQuery,
  },
});
