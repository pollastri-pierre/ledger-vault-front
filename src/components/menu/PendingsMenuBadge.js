//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import { getPendingsOperations } from "utils/operations";
import colors from "shared/colors";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    background: "#ea2e49", // FIXME use theme
    position: "absolute",
    right: "0",
    top: "0",
    backgroundColor: colors.grenade,
    color: "white",
    padding: "0 .6em",
    borderRadius: "1em",
    fontSize: 11,
    fontWeight: "600"
  }
};
class PendingsMenuBadge extends Component<*> {
  render() {
    const { accounts, operations, classes } = this.props;
    const filtered = getPendingsOperations(operations);
    const count = accounts.length + filtered.length;
    if (count === 0) {
      return false;
    }
    return <span className={classes.base}>{count}</span>;
  }
}

export default connectData(withStyles(styles)(PendingsMenuBadge), {
  queries: {
    accounts: PendingAccountsQuery,
    operations: PendingOperationsQuery
  }
});
