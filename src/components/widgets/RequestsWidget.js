// @flow

import React from "react";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";

import { withMe } from "components/UserContextProvider";
import RequestsQuery from "api/queries/RequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request, User } from "data/types";
import { RequestsList } from "components/lists";
import Box from "components/base/Box";
import {
  hasUserApprovedRequest,
  isNotTransaction,
  navigateToRequest,
} from "utils/request";

import Widget, { connectWidget } from "./Widget";

type Props = {
  data: Connection<Request>,
  history: MemoryHistory,
  me: User,
};

function RequestsWidget(props: Props) {
  const { data, me } = props;

  const requests = data.edges
    .map(el => el.node)
    .filter(me.role === "ADMIN" ? isNotTransaction : Boolean);

  const myRequests = requests.filter(
    request => request.approvals && !hasUserApprovedRequest(request, me),
  );

  const otherRequests = requests.filter(
    request => hasUserApprovedRequest(request, me) || !request.approvals,
  );

  const handleRequestClick = (request: Request) =>
    navigateToRequest(request, props.history);

  return (
    <Box flow={20}>
      <Widget
        title={<Trans i18nKey="adminDashboard:myRequestsTitle" />}
        desc={<Trans i18nKey="adminDashboard:myRequestsDesc" />}
      >
        <RequestsList
          emptyState={<Trans i18nKey="adminDashboard:myRequestsEmpty" />}
          dataTest="awaiting-approval"
          requests={myRequests}
          onRequestClick={handleRequestClick}
        />
      </Widget>
      <Widget
        title={<Trans i18nKey="adminDashboard:otherRequestsTitle" />}
        desc={<Trans i18nKey="adminDashboard:otherRequestsDesc" />}
      >
        <RequestsList
          emptyState={<Trans i18nKey="adminDashboard:otherRequestsEmpty" />}
          dataTest="pending-approval"
          requests={otherRequests}
          onRequestClick={handleRequestClick}
        />
      </Widget>
    </Box>
  );
}

export default connectWidget(withMe(RequestsWidget), {
  height: 250,
  queries: {
    data: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
    pageSize: -1,
  }),
});
