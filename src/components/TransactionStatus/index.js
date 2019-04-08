// @flow
import React, { Component } from "react";
import ConfirmationStatus from "components/ConfirmationStatus";
import EntityStatus from "components/EntityStatus";
import type { Transaction } from "data/types";

class TransactionStatus extends Component<*> {
  props: {
    operation: Transaction,
  };

  render() {
    const { operation } = this.props;

    if (operation.status === "SUBMITTED") {
      return <ConfirmationStatus nbConfirmations={operation.confirmations} />;
    }

    return (
      <EntityStatus
        status={operation.status}
        request={operation.last_request}
      />
    );
  }
}

export default TransactionStatus;