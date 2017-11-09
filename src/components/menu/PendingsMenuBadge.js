//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import PendingsQuery from "../../api/queries/PendingsQuery";

class PendingsMenuBadge extends Component<*> {
  render() {
    const { pendings } = this.props;
    const count =
      pendings.approveOperations.length + pendings.approveAccounts.length;
    return <span className="menu-badge">{count}</span>;
  }
}

export default connectData(PendingsMenuBadge, {
  queries: {
    pendings: PendingsQuery
  }
});
