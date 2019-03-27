// @flow

import React, { PureComponent } from "react";

import Box from "components/base/Box";

import PendingTransactionsCard from "./PendingTransactionsCard";

class OperatorDashboard extends PureComponent<*> {
  render() {
    return (
      <Box flow={20}>
        <PendingTransactionsCard />
      </Box>
    );
  }
}

export default OperatorDashboard;
