// @flow

import React from "react";
import { Trans } from "react-i18next";

import AccountsQuery from "api/queries/AccountsQuery";
import { SoftCard } from "components/base/Card";
import type { Connection } from "restlay/ConnectionQuery";
import { AccountsList } from "components/lists";
import type { Account } from "data/types";
import Widget, { connectWidget } from "./Widget";

type Props = {
  account: Account,
  accountsConnection: Connection<Account>,
};

function SubAccountsWidget(props: Props) {
  const { accountsConnection, account } = props;
  const accounts = accountsConnection.edges
    .map(a => a.node)
    .filter(a => a.parent === account.id);
  if (!accounts.length) return null;
  return (
    <Widget
      title={<Trans i18nKey="accountView:erc20_children" />}
      style={{ maxWidth: 400 }}
    >
      <SoftCard style={{ padding: 10 }}>
        <AccountsList accounts={accounts} />
      </SoftCard>
    </Widget>
  );
}

export default connectWidget(SubAccountsWidget, {
  height: 230,
  queries: {
    accountsConnection: AccountsQuery,
  },
});
