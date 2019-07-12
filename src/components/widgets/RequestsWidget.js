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

  const isAdmin = me.role === "ADMIN";

  const requests = data.edges
    .map(el => el.node)
    .filter(isAdmin ? isNotTransaction : Boolean);

  const myRequests = requests.filter(
    request => request.approvals && !hasUserApprovedRequest(request, me),
  );

  const otherRequests = requests.filter(
    request => hasUserApprovedRequest(request, me) || !request.approvals,
  );

  const handleRequestClick = (request: Request) =>
    navigateToRequest(request, props.history);

  const prefix = isAdmin ? "adminDashboard" : "operatorDashboard";
  const myRequestsTitle = <Trans i18nKey={`${prefix}:myRequestsTitle`} />;
  const myRequestsDesc = <Trans i18nKey={`${prefix}:myRequestsDesc`} />;
  const otherRequestsTitle = <Trans i18nKey={`${prefix}:otherRequestsTitle`} />;
  const otherRequestsDesc = <Trans i18nKey={`${prefix}:otherRequestsDesc`} />;
  const myEmpty = <Trans i18nKey={`${prefix}:myRequestsEmpty`} />;
  const otherEmpty = <Trans i18nKey={`${prefix}:otherRequestsEmpty`} />;

  return (
    <Box flow={20}>
      <Widget title={myRequestsTitle} desc={myRequestsDesc}>
        <RequestsList
          emptyState={myEmpty}
          dataTest="awaiting-approval"
          requests={myRequests}
          onRequestClick={handleRequestClick}
        />
      </Widget>
      <Widget title={otherRequestsTitle} desc={otherRequestsDesc}>
        <RequestsList
          emptyState={otherEmpty}
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
