// @flow
import React, { Component } from "react";
// FIXME FIXME FIXME put it back when gate send us the nb of confirmatinos
// import ConfirmationStatus from "components/ConfirmationStatus";
import EntityStatus from "components/EntityStatus";
import type { Transaction } from "data/types";

class TransactionStatus extends Component<*> {
  props: {
    transaction: Transaction,
  };

  render() {
    const { transaction } = this.props;

    // FIXME FIXME FIXME put it back when gate send us the nb of confirmatinos
    // if (transaction.status === "SUBMITTED") {
    //   return <ConfirmationStatus nbConfirmations={transaction.confirmations} />;
    // }

    return (
      <EntityStatus
        status={transaction.status}
        request={transaction.last_request}
      />
    );
  }
}

export default TransactionStatus;
