// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import Box from "components/base/Box";
import Card, { CardLoading, CardError } from "components/base/Card";

import Statistics from "./Statistics";
import Tasks from "./Tasks";
import Activity from "./Activity";
import Transactions from "./Transactions";

type Props = {
  history: MemoryHistory,
  match: Match,
};
class OperatorDashboard extends PureComponent<Props> {
  render() {
    const { history, match } = this.props;
    return (
      <Box flow={20}>
        <Card grow style={{ height: 250 }}>
          <Tasks history={history} match={match} />
        </Card>
        <Box flow={20} horizontal>
          <Card grow style={{ height: 250 }}>
            <Activity />
          </Card>
          <Card style={{ height: 250 }}>
            <Statistics />
          </Card>
        </Box>
        <Card grow>
          <Transactions history={history} match={match} />
        </Card>
      </Box>
    );
  }
}

export default connectData(OperatorDashboard, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {},
});
