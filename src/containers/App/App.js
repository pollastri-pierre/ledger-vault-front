// @flow
import React from "react";
import { translate } from "react-i18next";
import type { Match, Location } from "react-router-dom";
import type { Account } from "data/types";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import TryAgain from "components/TryAgain";
import Content from "containers/Content";
import ActionBar from "components/actionBar/ActionBar";
import UpdateAccountsInfo from "components/UpdateAccounts/UpdateAccountsInfo";
import UpdateAccounts from "components/UpdateAccounts";
import Menu from "containers/Menu";
import Card from "components/legacy/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import Box from "components/base/Box";
import UserContextProvider from "components/UserContextProvider";

const styles = {
  error: {
    margin: "auto",
    width: 500
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row"
  }
};
type Props = {
  location: Location,
  match: Match,
  accounts: Account[]
};
function App({ location, match, accounts }: Props) {
  let res = (
    <Box className="App">
      <ActionBar match={match} location={location} />
      <Box className="Main">
        <Box style={styles.contentContainer}>
          <Menu location={location} match={match} accounts={accounts} />
          <Content match={match} />
        </Box>
        <UpdateAccountsInfo accounts={accounts} />
        <UpdateAccounts accounts={accounts} />
      </Box>
    </Box>
  );
  res = <UserContextProvider>{res}</UserContextProvider>;
  return res;
}

const RenderError = ({ error, restlay }: *) => (
  <Box style={styles.error} mt={100}>
    <Card>
      <TryAgain error={error} action={restlay.forceFetch} />
    </Card>
  </Box>
);

const RenderLoading = () => <SpinnerCard />;

export default connectData(translate()(App), {
  RenderLoading,
  RenderError,
  queries: {
    accounts: AccountsQuery
  }
});
