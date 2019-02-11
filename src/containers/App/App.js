// @flow
import React from "react";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import type { Match, Location } from "react-router-dom";
import type { Account } from "data/types";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import TryAgain from "components/TryAgain";
import Content from "components/content/Content";
import ActionBar from "components/actionBar/ActionBar";
import UpdateAccountsInfo from "components/UpdateAccounts/UpdateAccountsInfo";
import UpdateAccounts from "components/UpdateAccounts";
import Menu from "components/menu/Menu";
import Card from "components/legacy/Card";
import SpinnerCard from "components/spinners/SpinnerCard";

const styles = {
  error: {
    margin: "auto",
    marginTop: 100,
    width: 500
  }
};
type Props = {
  location: Location,
  match: Match,
  accounts: Account[]
};
function App({ location, match, accounts }: Props) {
  return (
    <div className="App">
      <ActionBar match={match} location={location} />
      <div className="Main">
        <Menu location={location} match={match} accounts={accounts} />
        <Content match={match} />
        <UpdateAccountsInfo accounts={accounts} />
        <UpdateAccounts accounts={accounts} />
      </div>
    </div>
  );
}

const RenderError = withStyles(styles)(({ classes, error, restlay }) => (
  <div className={classes.error}>
    <Card>
      <TryAgain error={error} action={restlay.forceFetch} />
    </Card>
  </div>
));

const RenderLoading = () => <SpinnerCard />;

export default connectData(translate()(App), {
  RenderLoading,
  RenderError,
  queries: {
    accounts: AccountsQuery
  }
});
