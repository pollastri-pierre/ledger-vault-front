// @flow

import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import TryAgain from "components/TryAgain";
import type { Account } from "data/types";
import AccountCard from "./AccountCard";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -20
  }
};

type Props = {
  accounts: Account[],
  classes: { [_: $Keys<typeof styles>]: string }
};

class Storages extends Component<Props> {
  render() {
    const { accounts, classes } = this.props;
    return (
      <div className={classes.base}>
        {accounts.map((a, i) => (
          <AccountCard index={i} key={a.id} account={a} />
        ))}
      </div>
    );
  }
}

const RenderError = withStyles(styles)(({ error, restlay, classes }: *) => (
  <div className={classes.base}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
));

export default connectData(withStyles(styles)(Storages), {
  queries: {
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError
});
