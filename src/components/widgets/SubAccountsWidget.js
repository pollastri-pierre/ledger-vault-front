// @flow

import React from "react";
import { Trans } from "react-i18next";

import ChildAccountsQuery from "api/queries/ChildAccountsQuery";
import { SoftCard } from "components/base/Card";
import type { Connection } from "restlay/ConnectionQuery";
import { AccountsList } from "components/lists";
import type { Account } from "data/types";
import VaultLink from "components/VaultLink";
import Widget, { connectWidget } from "./Widget";

type Props = {
  account: Account,
  accountsConnection: Connection<Account>,
};

function SubAccountsWidget(props: Props) {
  const { accountsConnection, account } = props;
  const accounts = accountsConnection.edges.map(a => a.node);

  const desc = (
    <VaultLink withRole to={`/accounts?parent=${account.id}`}>
      {`View all (${accountsConnection.pageInfo.count})`}
    </VaultLink>
  );
  const title = <Trans i18nKey="accountView:erc20_children" />;
  return (
    <Widget title={title} desc={desc}>
      {accounts.length ? (
        <AccountsList accounts={accounts} />
      ) : (
        <SoftCard style={{ padding: 10 }}>No children accounts</SoftCard>
      )}
    </Widget>
  );
}

export default connectWidget(SubAccountsWidget, {
  height: 230,
  queries: {
    accountsConnection: ChildAccountsQuery,
  },
  propsToQueryParams: (props: Props) => ({
    parentAccountID: props.account.id,
  }),
});
