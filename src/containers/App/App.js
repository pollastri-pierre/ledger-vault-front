// @flow
import React, { useState, useCallback, useEffect } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useTranslation } from "react-i18next";
import { Route, withRouter, NavLink } from "react-router-dom";
import styled from "styled-components";
import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";
import { FaArrowLeft } from "react-icons/fa";

import type { Account, User, Transaction, Organization } from "data/types";
import connectData from "restlay/connectData";
import SearchAccounts from "api/queries/SearchAccounts";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import AccountQuery from "api/queries/AccountQuery";
import TryAgain from "components/TryAgain";
import Content from "containers/Content";
import Modals from "containers/Modals";
import Card from "components/base/Card";
import Text from "components/base/Text";
import { LoginLoading } from "components/Login";
import VaultLink from "components/VaultLink";
import CheckMigration from "components/CheckMigration";
import Box from "components/base/Box";
import UserContextProvider, { withMe } from "components/UserContextProvider";
import { OrganizationContextProvider } from "components/OrganizationContext";
import { useVersions } from "components/VersionsContext";
import VaultLayout from "components/VaultLayout";

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
  const update = useCallback(async () => {
    const newOrg = await restlay.fetchQuery(new OrganizationQuery());
    setOrg(newOrg);
  }, [setOrg, restlay]);
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

const SubMenuItem = styled(({ borderColor, ...p }) => <NavLink {...p} />)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 60px;
  &.active:after {
    position: absolute;
    margin-top: -3px;
    top: 100%;
    content: "";
    width: 100%;
    height: 3px;
    background: ${(p) => p.borderColor};
  }
`;

const removeSuffix = (pathname) => {
  const arr = pathname.split("/");
  return arr.slice(0, arr.length - 1).join("/");
};

const HACKY_UTXO_MODAL_INDEX = 6;
const HACKY_UTXO_MODAL_IDENTIFIER = "utxo";

// we need the account to know
// - the color
// - the currency family
const TopBarAccountMenu = withRouter(
  connectData(
    (props) => {
      const { location, account } = props;
      const { t } = useTranslation();
      const currency = getCryptoCurrencyById(account.currency);
      if (!currency || currency.family !== "bitcoin") return false;

      const pathArray = location.pathname.split("/");

      const overviewLink =
        pathArray[HACKY_UTXO_MODAL_INDEX] === HACKY_UTXO_MODAL_IDENTIFIER
          ? removeSuffix(location.pathname)
          : location.pathname;

      const utxoLink =
        pathArray[HACKY_UTXO_MODAL_INDEX] === HACKY_UTXO_MODAL_IDENTIFIER
          ? location.pathname
          : `${location.pathname}/utxo`;

      return (
        <Box horizontal align="center" flow={20}>
          <SubMenuItem borderColor={currency.color} exact to={overviewLink}>
            {t("accountView:overview")}
          </SubMenuItem>
          <SubMenuItem borderColor={currency.color} to={utxoLink}>
            {t("accountView:UTXOs")}
          </SubMenuItem>
        </Box>
      );
    },
    {
      queries: {
        account: AccountQuery,
      },
      propsToQueryParams: (props) => ({
        accountId: props.match.params.id,
      }),
    },
  ),
);
const TopBarContent = () => {
  return (
    <Route
      path={[
        "/:org/:role/accounts/view/:id",
        "/:org/:role/accounts/view/:id/utxo",
      ]}
    >
      <Box horizontal flow={20} align="center">
        <VaultLink
          withRole
          to="/accounts?meta_status=APPROVED&meta_status=PENDING"
        >
          <Box horizontal align="center" flow={5} py={10}>
            <FaArrowLeft />
            <Text i18nKey="accountView:backButton" />
          </Box>
        </VaultLink>
        <TopBarAccountMenu />
      </Box>
    </Route>
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

  const { update } = useVersions();
  useEffect(() => {
    update();
  }, [update]);
  const menuItems = getMenuItems({
    role: me.role,
    accounts: accounts.edges.map((e) => e.node),
    allPendingTransactions: allPendingTransactions.edges.map((e) => e.node),
    match,
    location,
  });

  const handleLogout = () => {
    const org = match.params.workspace || "";
    history.push(`/${org}/logout`);
  };

  return (
    <>
      <VaultLayout
        menuItems={menuItems}
        user={me}
        onLogout={handleLogout}
        match={match}
        TopBarContent={TopBarContent}
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

export default connectData(AppWrapper, {
  RenderLoading: LoginLoading,
  RenderError,
  queries: {
    me: ProfileQuery,
    accounts: SearchAccounts,
    allPendingTransactions: PendingTransactionsQuery,
    organization: OrganizationQuery,
  },
});
