//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import AccountCard from "./AccountCard";
import AccountsQuery from "../../api/queries/AccountsQuery";
import injectSheet from "react-jss";
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

const RenderError = ({ error, restlay }: *) => (
  <TryAgain error={error} action={restlay.forceFetch} />
);

export default connectData(injectSheet(styles)(Storages), {
  queries: {
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError
});
