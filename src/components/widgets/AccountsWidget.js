// @flow

import React from "react";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import colors from "shared/colors";
import Card from "components/base/Card";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/base/Button";
import { AccountsList } from "components/lists";
import SearchAccounts from "api/queries/SearchAccounts";
import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { AccountsListConfig } from "components/lists/AccountsList";
import { useMe } from "components/UserContextProvider";
import Widget, { connectWidget } from "./Widget";

type Props = {
  accountsConnection: Connection<Account>,
  history: MemoryHistory,
  location: Location,
};

const ACCOUNTS_LIST_CONFIG: $Shape<AccountsListConfig> = {
  showAvailableBalance: true,
};

function AccountsWidget(props: Props) {
  const { accountsConnection, history, location } = props;
  const me = useMe();
  const accounts = accountsConnection.edges.map((n) => n.node);
  const onAdd = () => history.push(`${location.pathname}/accounts/new`);
  const addButton = (
    <Button type="filled" onClick={onAdd}>
      Create an account
    </Button>
  );
  return (
    <Widget title="Accounts" height={accounts.length ? undefined : 300}>
      {accounts.length ? (
        <AccountsList accounts={accounts} config={ACCOUNTS_LIST_CONFIG} />
      ) : (
        <Card grow flow={20} style={{ padding: 10 }}>
          {me.role === "ADMIN" ? (
            <Box grow align="center" justify="center">
              {addButton}
            </Box>
          ) : (
            <Box grow align="center" justify="center">
              <Text color={colors.textLight}>No accounts.</Text>
            </Box>
          )}
        </Card>
      )}
    </Widget>
  );
}

export default connectWidget(AccountsWidget, {
  height: 300,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: () => ({
    meta_status: "APPROVED",
  }),
});
