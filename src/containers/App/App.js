// @flow
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import type { Account, User, Transaction, Organization } from "data/types";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import TryAgain from "components/TryAgain";
import Content from "containers/Content";
import Modals from "containers/Modals";
import Card from "components/base/Card";
import CheckMigration from "components/CheckMigration";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import {
  OrganizationContextProvider,
  useOrganization,
} from "components/OrganizationContext";
import VaultLayout from "components/VaultLayout";
import VaultCentered from "components/VaultCentered";
import ConnectedBreadcrumb from "components/ConnectedBreadcrumb";

import type { Connection } from "restlay/ConnectionQuery";
import getMenuItems from "./getMenuItems";

type Props = {
  me: User,
  match: Match,
  location: Location,
  history: MemoryHistory,
  accounts: Connection<Account>,
  allPendingTransactions: Connection<Transaction>,
  organization: Organization,
};

const AppWrapper = ({ me, organization, ...props }: Props) => (
  <UserContextProvider me={me}>
    <OrganizationContextProvider value={organization}>
      <App {...props} />
    </OrganizationContextProvider>
  </UserContextProvider>
);

const breadcrumbConfig = [
  {
    path: "",
    render: p => p.organization.name,
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
  const organization = useOrganization();
  return (
    <ConnectedBreadcrumb
      prefix={`/${window.location.pathname.split("/")[1]}`}
      config={breadcrumbConfig}
      additionalProps={{ organization, ...props }}
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
      <CircularProgress size={20} />
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
    organization: OrganizationQuery,
  },
});
