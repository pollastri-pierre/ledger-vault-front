// @flow

import React, { PureComponent } from "react";

import Box from "components/base/Box";

import PendingOperationsCard from "./PendingOperationsCard";

class OperatorDashboard extends PureComponent<*> {
  render() {
    return (
      <Box flow={20}>
        <PendingOperationsCard />
      </Box>
    );
  }
}

export default OperatorDashboard;
