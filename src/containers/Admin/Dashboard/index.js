// @flow

import React, { PureComponent, Fragment } from "react";
import connectData from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";

import ModalRoute from "components/ModalRoute";
import RequestsTable from "components/Table/RequestsTable";
import Card, { CardLoading, CardError } from "components/base/Card";
import type { MemoryHistory } from "history";
import type { Match } from "react-router-dom";
import type { Request } from "data/types";

import PendingRequest from "./PendingRequest";

type Props = {
  data: Object,
  match: Match,
  history: MemoryHistory,
};
class AdminDashboard extends PureComponent<Props> {
  handleTaskClick = (request: Request) => {
    if (request.target_type === "GROUP") {
      this.props.history.push(`dashboard/groups/${request.target_id}`);
    } else {
      this.props.history.push(`dashboard/pending-requests/${request.id}`);
    }
  };

  render() {
    const { data, match } = this.props;
    const requests = data.edges.map(el => el.node);
    return (
      <Fragment>
        <Card>
          <RequestsTable data={requests} onRowClick={this.handleTaskClick} />
        </Card>
        <ModalRoute
          path={`${match.url}/pending-requests/:requestID`}
          component={PendingRequest}
        />
      </Fragment>
    );
  }
}

export default connectData(AdminDashboard, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    data: PendingRequestsQuery,
  },
});
