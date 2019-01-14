// @flow
import React from "react";
import TryAgain from "components/TryAgain";
import connectData from "restlay/connectData";
import type { Account } from "data/types";
import AccountsQuery from "api/queries/AccountsQuery";
import { translate } from "react-i18next";
import Content from "components/content/Content";
import ActionBar from "components/actionBar/ActionBar";
import { withStyles } from "@material-ui/core/styles";
import UpdateAccountsInfo from "components/UpdateAccounts/UpdateAccountsInfo";
import UpdateAccounts from "components/UpdateAccounts";
import Menu from "components/menu/Menu";
import Card from "components/Card";

const styles = {
  error: {
    margin: "auto",
    marginTop: 100,
    width: 500
  }
};
type Props = {
  location: *,
  match: *,
  accounts: Account[]
};
function App({ location, match, accounts }: Props) {
  return (
    <div className="App">
      <ActionBar match={match} location={location} accounts={accounts} />
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

export default connectData(translate()(App), {
  RenderError,
  queries: {
    accounts: AccountsQuery
  }
});
