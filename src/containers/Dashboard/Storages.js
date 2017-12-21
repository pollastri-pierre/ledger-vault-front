//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import AccountCard from "./AccountCard";
import AccountsQuery from "../../api/queries/AccountsQuery";
import { withStyles } from "material-ui/styles";
import TryAgain from "../../components/TryAgain";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: "-20px"
  }
};
class Storages extends Component<{ accounts: *, filter: *, classes: * }> {
  render() {
    const { accounts, filter, classes } = this.props;
    return (
      <div className={classes.base}>
        {accounts.map(a => (
          <AccountCard key={a.id} account={a} filter={filter} />
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
