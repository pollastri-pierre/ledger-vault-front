// @flow
import React, { Fragment } from "react";
import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import type { Account, User, Transaction } from "data/types";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import TryAgain from "components/TryAgain";
import Content from "containers/Content";
import UpdateAccountsInfo from "components/UpdateAccounts/UpdateAccountsInfo";
import Modals from "containers/Modals";
import Card from "components/legacy/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import VaultLayout from "components/VaultLayout";

import type { Connection } from "restlay/ConnectionQuery";
import getMenuItems from "./getMenuItems";

type Props = {
  match: Match,
  location: Location,
  history: MemoryHistory,
  accounts: Connection<Account>,
  allPendingTransactions: Transaction[],
};

const AppWrapper = (props: Props) => (
  <UserContextProvider>
    <App {...props} />
  </UserContextProvider>
);

const App = withMe((props: Props & { me: User }) => {
  const {
    match,
    history,
    accounts,
    allPendingTransactions,
    me,
    location,
  } = props;

  const menuItems = getMenuItems({
    role: me.role,
    accounts: accounts.edges.map(e => e.node),
    allPendingTransactions,
    match,
    location,
  });

  const handleLogout = () => {
    const org = match.params.orga_name || "";
    history.push(`/${org}/logout`);
  };

  return (
    <Fragment>
      <VaultLayout
        menuItems={menuItems}
        user={me}
        onLogout={handleLogout}
        match={match}
      >
        <Content match={match} />
      </VaultLayout>
      <UpdateAccountsInfo accounts={accounts.edges.map(e => e.node)} />
      <Modals match={match} />
    </Fragment>
  );
});

const RenderError = ({ error, restlay }: *) => (
  <Box style={{ margin: "auto", width: 500 }} mt={100}>
    <Card>
      <TryAgain error={error} action={restlay.forceFetch} />
    </Card>
  </Box>
);

const RenderLoading = () => <SpinnerCard />;

export default connectData(AppWrapper, {
  RenderLoading,
  RenderError,
  queries: {
    accounts: AccountsQuery,
    allPendingTransactions: PendingTransactionsQuery,
  },
});
