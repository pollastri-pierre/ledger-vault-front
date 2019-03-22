// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";

import RequestsTable from "components/Table/RequestsTable";
import Card, {
  CardLoading,
  CardError,
  CardTitle,
  CardDesc,
} from "components/base/Card";
import Box from "components/base/Box";
import type { MemoryHistory } from "history";
import type { Request, User } from "data/types";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  data: Object,
  history: MemoryHistory,
  me: User,
};

class AdminDashboard extends PureComponent<Props> {
  handleRowClick = (request: Request) => {
    if (request.target_type === "GROUP") {
      this.props.history.push(`dashboard/groups/${request.target_id}`);
    } else if (request.target_type === "PERSON") {
      this.props.history.push(`dashboard/users/details/${request.target_id}`);
    } else {
      this.props.history.push(`dashboard/requests/${request.id}`);
    }
  };

  render() {
    const { data, me } = this.props;
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
          <RequestsTable data={myRequests} onRowClick={this.handleRowClick} />
        </Card>
        <Card>
          <CardTitle noMargin i18nKey="adminDashboard:otherRequestsTitle" />
          <CardDesc i18nKey="adminDashboard:otherRequestsDesc" />
          <RequestsTable
            data={otherRequests}
            onRowClick={this.handleRowClick}
          />
        </Card>
      </Box>
    );
  }
}

export default connectData(withMe(AdminDashboard), {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    data: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: "PENDING_APPROVAL",
  }),
});
