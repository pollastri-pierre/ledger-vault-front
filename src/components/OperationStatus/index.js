//@flow
import React, { Component } from "react";
import ConfirmationStatus from "components/ConfirmationStatus";
import type { Operation } from "data/types";

class OperationStatus extends Component<*> {
  props: {
    operation: Operation
  };

  render() {
    const { operation } = this.props;

    if (operation.status === "SUBMITTED") {
      return <ConfirmationStatus nbConfirmations={operation.confirmations} />;
    }

    if (operation.status === "ABORTED") {
      return <span>ABORTED</span>;
    }

    if (operation.status === "PENDING_APPROVAL") {
      return <span>PENDING</span>;
    }

    return null;
  }
}

export default OperationStatus;
