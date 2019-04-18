// @flow
import React, { Fragment } from "react";
import { Trans } from "react-i18next";
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
import Card from "components/base/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import VaultLayout from "components/VaultLayout";
import ConnectedBreadcrumb from "components/ConnectedBreadcrumb";

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

const breadcrumbConfig = [
  {
    path: "",
    render: p => <Trans i18nKey={`common:role.${p.me.role}`} />,
    children: [
      { path: "*/receive", render: "Receive", exact: true },
      { path: "*/send", render: "Send", exact: true },
      { path: "/:role/dashboard", render: "Dashboard", exact: true },
      { path: "/:role/tasks", render: "Admin tasks", exact: true },
      { path: "/:role/groups", render: "Groups", exact: true },
      { path: "/:role/users", render: "Users", exact: true },
      {
        path: "/:role/accounts",
        render: "Accounts",
        children: [
          { path: "/:role/accounts/:id", render: p => p.match.params.id },
        ],
      },
      { path: "/:role/transactions*", render: "Transactions", exact: true },
    ],
  },
];

const AppBreadcrumb = withMe(({ me }) => (
  <ConnectedBreadcrumb
    prefix={`/${window.location.pathname.split("/")[1]}`}
    config={breadcrumbConfig}
    additionalProps={{ me }}
  />
));

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
        BreadcrumbComponent={AppBreadcrumb}
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
