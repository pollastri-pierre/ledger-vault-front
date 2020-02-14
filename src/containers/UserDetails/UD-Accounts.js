// @flow

import React, { useMemo } from "react";

import connectData from "restlay/connectData";
import SearchAccounts from "api/queries/SearchAccounts";
import { WidgetLoading } from "components/widgets/Widget";
import { RestlayTryAgain } from "components/TryAgain";
import { AccountsList } from "components/lists";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account } from "data/types";

type Props = {
  accountsConnection: Connection<Account>,
};

const UserDetailsAccounts = (props: Props) => {
  const { accountsConnection } = props;
  const accounts = useMemo(
    () => accountsConnection.edges.map(edge => edge.node),
    [accountsConnection],
  );
  return <AccountsList accounts={accounts} />;
};

export default connectData(UserDetailsAccounts, {
  RenderLoading: () => <WidgetLoading height={220} />,
  RenderError: RestlayTryAgain,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: props => ({
    user: props.userID,
    pageSize: -1,
  }),
});
