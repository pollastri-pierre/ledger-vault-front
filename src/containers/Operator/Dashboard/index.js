// @flow

import React from "react";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import ResponsiveContainer from "components/base/ResponsiveContainer";
import Box from "components/base/Box";
import {
  AccountsWidget,
  ActivityWidget,
  TotalBalanceWidget,
  RequestsWidget,
} from "components/widgets";

type Props = {
  history: MemoryHistory,
  location: Location,
};

const OperatorDashboard = (props: Props) => {
  const { history, location } = props;
  return (
    <ResponsiveContainer style={{ alignItems: "stretch" }}>
      <Box flex={1} flow={20}>
        <RequestsWidget history={history} />
        <ActivityWidget />
      </Box>
      <Box flex={1} flow={20}>
        <TotalBalanceWidget />
        <AccountsWidget history={history} location={location} />
      </Box>
    </ResponsiveContainer>
  );
};

export default OperatorDashboard;
