// @flow

import React from "react";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import ResponsiveContainer from "components/base/ResponsiveContainer";
import Box from "components/base/Box";
import {
  AccountsWidget,
  TotalBalanceWidget,
  RequestsWidget,
  LastTransactionsWidget,
} from "components/widgets";

type Props = {
  history: MemoryHistory,
  location: Location,
};

const OperatorDashboard = (props: Props) => {
  const { history, location } = props;
  return (
    <Box flow={20}>
      <ResponsiveContainer style={{ alignItems: "stretch" }}>
        <Box flex={1} flow={20}>
          <RequestsWidget history={history} />
        </Box>
        <Box flex={1} flow={20}>
          <TotalBalanceWidget />
          <AccountsWidget history={history} location={location} />
        </Box>
      </ResponsiveContainer>
      <LastTransactionsWidget />
    </Box>
  );
};

export default OperatorDashboard;
