// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import SpinnerCard from "components/spinners/SpinnerCard";
import AccountsQuery from "api/queries/AccountsQuery";
import Card from "components/Card";
import type { Account } from "data/types";
import DataTableAccount from "components/DataTableAccount";

type Props = {
  accounts: Account[],
  account: Account
};

const RenderLoading = () => (
  <Card title={<Trans i18nKey="accountView:erc20_children" />}>
    <SpinnerCard />
  </Card>
);
class SubAccounts extends Component<Props> {
  render() {
    const { accounts, account } = this.props;
    const children = accounts.filter(a => a.parent_id === account.id);
    const columns = ["date", "account", "status", "amount"];
    if (children.length === 0) {
      return null;
    }
    return (
      <Card title={<Trans i18nKey="accountView:erc20_children" />}>
        {children.length > 0 ? (
          <DataTableAccount accounts={children} columnIds={columns} />
        ) : (
          <Trans i18nKey="accountView:no_erc20_children" />
        )}
      </Card>
    );
  }
}

export default connectData(SubAccounts, {
  RenderLoading,
  queries: {
    accounts: AccountsQuery
  }
});
