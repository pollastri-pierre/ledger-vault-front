// @flow

import React, { useMemo } from "react";

import connectData from "restlay/connectData";
import SearchAccounts from "api/queries/SearchAccounts";
import { WidgetLoading } from "components/widgets/Widget";
import { RestlayTryAgain } from "components/TryAgain";
import { AccountsList } from "components/lists";
import type { AccountsListConfig } from "components/lists/AccountsList";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account } from "data/types";

type Props = {
  accountsConnection: Connection<Account>,
};

const ACCOUNTS_LIST_CONFIG: $Shape<AccountsListConfig> = {
  displayBalance: false,
};

const UserDetailsAccounts = (props: Props) => {
  const { accountsConnection } = props;
  const accounts = useMemo(
    () => accountsConnection.edges.map((edge) => edge.node),
    [accountsConnection],
  );
  return (
    <AccountsList
      display="grid"
      tileWidth={250}
      accounts={accounts}
      config={ACCOUNTS_LIST_CONFIG}
    />
  );
};

export default connectData(UserDetailsAccounts, {
  RenderLoading: () => <WidgetLoading height={220} />,
  RenderError: RestlayTryAgain,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: (props) => ({
    user: props.userID,
    pageSize: -1,
  }),
});
