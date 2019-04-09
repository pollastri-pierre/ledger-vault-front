// @flow

import React, { PureComponent } from "react";
import TransactionStatus from "components/TransactionStatus";
import Box from "components/base/Box";

import type { Transaction } from "data/types";

class TxStatus extends PureComponent<{
  operation: Transaction,
}> {
  render() {
    const { operation } = this.props;

    return (
      <Box width={150} align="flex-start">
        <TransactionStatus operation={operation} />
      </Box>
    );
  }
}

export default TxStatus;
