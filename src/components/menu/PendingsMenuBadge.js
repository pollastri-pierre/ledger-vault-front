//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";

class PendingsMenuBadge extends Component<*> {
  render() {
    const { pendings } = this.props;
    const count =
      pendings.approveOperations.length + pendings.approveAccounts.length;
    return <span className="menu-badge">{count}</span>;
  }
}

export default connectData(PendingsMenuBadge, {
  api: {
    pendings: api.pendings
  }
});
