// @flow
import React, { Component } from "react";
import ConfirmationStatus from "components/ConfirmationStatus";
import EntityStatus from "components/EntityStatus";
import type { Transaction } from "data/types";

class TransactionStatus extends Component<*> {
  props: {
    transaction: Transaction,
  };

  render() {
    const { transaction } = this.props;

    if (transaction.status === "SUBMITTED" && transaction.confirmations) {
      return <ConfirmationStatus nbConfirmations={transaction.confirmations} />;
    }

    return (
      <EntityStatus
        status={transaction.status}
        request={transaction.last_request}
      />
    );
  }
}

export default TransactionStatus;
