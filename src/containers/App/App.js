// @flow
import React, { useState } from "react";
import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import type { Account, User, Transaction, Organization } from "data/types";
import connectData from "restlay/connectData";
import SearchAccounts from "api/queries/SearchAccounts";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import TryAgain from "components/TryAgain";
import Spinner from "components/base/Spinner";
import Content from "containers/Content";
import Modals from "containers/Modals";
import Card from "components/base/Card";
import CheckMigration from "components/CheckMigration";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import { OrganizationContextProvider } from "components/OrganizationContext";
import VaultLayout from "components/VaultLayout";
import VaultCentered from "components/VaultCentered";

import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import getMenuItems from "./getMenuItems";

type Props = {
  me: User,
  restlay: RestlayEnvironment,
  match: Match,
  location: Location,
  history: MemoryHistory,
  accounts: Connection<Account>,
  allPendingTransactions: Connection<Transaction>,
  organization: Organization,
};

const AppWrapper = ({ me, organization, restlay, ...props }: Props) => {
  const [org, setOrg] = useState(organization);
  const update = async () => {
    const newOrg = await restlay.fetchQuery(new OrganizationQuery());
    setOrg(newOrg);
  };
  return (
    <UserContextProvider me={me}>
      <OrganizationContextProvider
        value={{ organization: org, refresh: update }}
      >
        <App {...props} />
      </OrganizationContextProvider>
    </UserContextProvider>
  );
};

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
      <Spinner />
    </Card>
  </VaultCentered>
);

export default connectData(AppWrapper, {
  RenderLoading,
  RenderError,
  queries: {
    me: ProfileQuery,
    accounts: SearchAccounts,
    allPendingTransactions: PendingTransactionsQuery,
    organization: OrganizationQuery,
  },
});
