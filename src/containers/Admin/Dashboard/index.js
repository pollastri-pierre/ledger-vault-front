// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";

import ModalRoute from "components/ModalRoute";
import RequestsTable from "components/Table/RequestsTable";
import Card, {
  CardLoading,
  CardError,
  CardTitle,
  CardDesc,
} from "components/base/Card";
import Box from "components/base/Box";
import type { MemoryHistory } from "history";
import type { Match } from "react-router-dom";
import type { Request, User } from "data/types";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";

import PendingRequest from "./PendingRequest";

type Props = {
  data: Object,
  match: Match,
  history: MemoryHistory,
  me: User,
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
    const { data, match, me } = this.props;
    const requests = data.edges.map(el => el.node);
    const myRequests = requests.filter(
      request => !hasUserApprovedRequest(request, me),
    );
    const otherRequests = requests.filter(request =>
      hasUserApprovedRequest(request, me),
    );

    return (
      <Box flow={20}>
        <Card>
          <CardTitle noMargin i18nKey="adminDashboard:myRequestsTitle" />
          <CardDesc i18nKey="adminDashboard:myRequestsDesc" />
          <RequestsTable data={myRequests} onRowClick={this.handleTaskClick} />
        </Card>
        <Card>
          <CardTitle noMargin i18nKey="adminDashboard:otherRequestsTitle" />
          <CardDesc i18nKey="adminDashboard:otherRequestsDesc" />
          <RequestsTable
            data={otherRequests}
            onRowClick={this.handleTaskClick}
          />
        </Card>
        <ModalRoute
          path={`${match.url}/pending-requests/:requestID`}
          component={PendingRequest}
        />
      </Box>
    );
  }
}

export default connectData(withMe(AdminDashboard), {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    data: PendingRequestsQuery,
  },
});
