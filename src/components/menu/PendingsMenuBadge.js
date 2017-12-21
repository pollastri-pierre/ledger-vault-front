//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import PendingsQuery from "../../api/queries/PendingsQuery";
import colors from "../../shared/colors";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    background: "red",
    position: "absolute",
    right: "0",
    top: "0",
    backgroundColor: colors.grenade,
    color: "white",
    padding: "0 .6em",
    borderRadius: "1em",
    fontSize: "11px",
    fontWeight: "600"
  }
};
class PendingsMenuBadge extends Component<*> {
  render() {
    const { pendings, classes } = this.props;
    const count =
      pendings.approveOperations.length + pendings.approveAccounts.length;
    return <span className={classes.base}>{count}</span>;
  }
}

export default connectData(withStyles(styles)(PendingsMenuBadge), {
  queries: {
    pendings: PendingsQuery
  }
});
