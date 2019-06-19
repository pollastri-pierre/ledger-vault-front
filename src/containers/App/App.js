// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import type { Account, User, Transaction } from "data/types";
import colors from "shared/colors";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import TryAgain from "components/TryAgain";
import Content from "containers/Content";
import Modals from "containers/Modals";
import Card from "components/base/Card";
import CheckMigration from "components/CheckMigration";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import VaultLayout from "components/VaultLayout";
import VaultCentered from "components/VaultCentered";
import ConnectedBreadcrumb from "components/ConnectedBreadcrumb";
import AdminIcon from "components/icons/AdminIcon";
import OperatorIcon from "components/icons/OperatorIcon";

import type { Connection } from "restlay/ConnectionQuery";
import getMenuItems from "./getMenuItems";

const adminIcon = <AdminIcon size={16} color={colors.blue} />;
const operatorIcon = <OperatorIcon size={16} color={colors.blue} />;

type Props = {
  me: User,
  match: Match,
  location: Location,
  history: MemoryHistory,
  accounts: Connection<Account>,
  allPendingTransactions: Connection<Transaction>,
};

const AppWrapper = ({ me, ...props }: Props) => (
  <UserContextProvider me={me}>
    <App {...props} />
  </UserContextProvider>
);

const breadcrumbConfig = [
  {
    path: "",
    render: p => (
      <Box horizontal align="center" flow={5}>
        {p.me.role === "ADMIN" ? adminIcon : operatorIcon}
        <span>
          <Trans i18nKey={`common:role.${p.me.role}`} />
        </span>
      </Box>
    ),
    children: [
      { path: "/:role/dashboard*", render: "Dashboard", exact: true },
      { path: "/:role/tasks*", render: "All requests", exact: true },
      { path: "/:role/groups*", render: "Groups", exact: true },
      { path: "/:role/users*", render: "Users", exact: true },
      {
        path: "/:role/accounts",
        render: "Accounts",
        children: [
          {
            path: "/:role/accounts/view/:id",
            render: ({ match, accounts }) => {
              const account = accounts.edges.find(
                i => i.node.id.toString() === match.params.id,
              );
              return account ? account.node.name : match.params.id;
            },
          },
        ],
      },
      {
        path: "/:role/transactions",
        render: "Transactions",
        children: [
          {
            path: "/:role/transactions/receive",
            render: "Receive",
            exact: true,
          },
          { path: "/:role/transactions/send", render: "Send", exact: true },
        ],
      },
    ],
  },
];

const AppBreadcrumb = withMe(props => {
  return (
    <ConnectedBreadcrumb
      prefix={`/${window.location.pathname.split("/")[1]}`}
      config={breadcrumbConfig}
      additionalProps={props}
    />
  );
});

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
    allPendingTransactions: allPendingTransactions.edges.map(e => e.node),
    match,
    location,
  });

  const handleLogout = () => {
    const org = match.params.orga_name || "";
    history.push(`/${org}/logout`);
  };

  return (
    <>
      <VaultLayout
        menuItems={menuItems}
        user={me}
        onLogout={handleLogout}
        match={match}
        BreadcrumbComponent={() => <AppBreadcrumb accounts={accounts} />}
      >
        {me.role === "ADMIN" && <CheckMigration />}
        <Content match={match} />
      </VaultLayout>
      <Modals match={match} />
    </>
  );
});

const RenderError = ({ error, restlay }: *) => (
  <Box style={{ margin: "auto", width: 500 }} mt={100}>
    <Card>
      <TryAgain error={error} action={restlay.forceFetch} />
    </Card>
  </Box>
);

const RenderLoading = () => (
  <VaultCentered>
    <Card align="center" justify="center" height={350}>
      {"..."}
    </Card>
  </VaultCentered>
);

export default connectData(AppWrapper, {
  RenderLoading,
  RenderError,
  queries: {
    me: ProfileQuery,
    accounts: AccountsQuery,
    allPendingTransactions: PendingTransactionsQuery,
  },
});
