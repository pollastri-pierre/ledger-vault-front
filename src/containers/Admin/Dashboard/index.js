// @flow

import React from "react";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import ResponsiveContainer from "components/base/ResponsiveContainer";
import Box from "components/base/Box";
import {
  AccountsWidget,
  QuorumWidget,
  TotalBalanceWidget,
  RequestsWidget,
} from "components/widgets";

type Props = {
  history: MemoryHistory,
  location: Location,
};

function AdminDashboard(props: Props) {
  const { history, location } = props;
  return (
    <ResponsiveContainer style={{ alignItems: "stretch" }}>
      <Box flex={1} flow={20}>
        <RequestsWidget history={history} />
      </Box>
      <Box flex={1} flow={20}>
        <TotalBalanceWidget />
        <QuorumWidget history={history} location={location} />
        <AccountsWidget history={history} location={location} />
      </Box>
    </ResponsiveContainer>
  );
}

export default AdminDashboard;
