//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import PendingsQuery from "../../api/queries/PendingsQuery";

class PendingsMenuBadge extends Component<*> {
  render() {
    const { pendings } = this.props;
    const count =
      pendings.approveOperations.length + pendings.approveAccounts.length;
    return (
      <span
        style={{
          backgroundColor: "#ea2e49", // FIXME theme
          color: "#fff",
          fontSize: 11,
          fontWeight: "bold",
          padding: "0 0.6em",
          borderRadius: "1em"
        }}
      >
        {count}
      </span>
    );
  }
}

export default connectData(PendingsMenuBadge, {
  queries: {
    pendings: PendingsQuery
  }
});
