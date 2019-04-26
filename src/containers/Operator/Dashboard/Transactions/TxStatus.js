// @flow

import React, { PureComponent } from "react";
import TransactionStatus from "components/TransactionStatus";
import Box from "components/base/Box";

import type { Transaction } from "data/types";

class TxStatus extends PureComponent<{
  transaction: Transaction,
}> {
  render() {
    const { transaction } = this.props;

    return (
      <Box width={150} align="flex-start">
        <TransactionStatus transaction={transaction} />
      </Box>
    );
  }
}

export default TxStatus;
