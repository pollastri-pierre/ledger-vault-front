// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import type { MemoryHistory } from "history";

import { withMe } from "components/UserContextProvider";
import RequestsQuery from "api/queries/RequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { GenericRequest, User } from "data/types";
import { RequestsList } from "components/lists";
import Box from "components/base/Box";
import {
  hasUserApprovedRequest,
  isUserInCurrentStep,
  isNotTransaction,
  navigateToRequest,
} from "utils/request";

import Widget, { connectWidget } from "./Widget";

type Props = {
  data: Connection<GenericRequest>,
  history: MemoryHistory,
  me: User,
};

function RequestsWidget(props: Props) {
  const { data, me } = props;
  const { t } = useTranslation();
  const isAdmin = me.role === "ADMIN";

  const requests = data.edges
    .map((el) => el.node)
    .filter(isAdmin ? isNotTransaction : Boolean);

  const myRequests = requests.filter(
    (request) =>
      request.approvals &&
      !hasUserApprovedRequest(request, me) &&
      isUserInCurrentStep(request, me),
  );

  const otherRequests = requests.filter(
    (request) =>
      hasUserApprovedRequest(request, me) ||
      !request.approvals ||
      !isUserInCurrentStep(request, me),
  );

  const handleRequestClick = (request: GenericRequest) =>
    navigateToRequest(request, props.history);

  const prefix = isAdmin ? "adminDashboard" : "operatorDashboard";
  const myRequestsTitle = t(`${prefix}:myRequestsTitle`);
  const otherRequestsTitle = t(`${prefix}:otherRequestsTitle`);
  const myEmpty = t(`${prefix}:myRequestsEmpty`);
  const otherEmpty = t(`${prefix}:otherRequestsEmpty`);

  return (
    <Box flow={20}>
      <Widget title={myRequestsTitle}>
        <RequestsList
          emptyState={myEmpty}
          dataTest="awaiting-approval"
          requests={myRequests}
          onRequestClick={handleRequestClick}
        />
      </Widget>
      <Widget title={otherRequestsTitle}>
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
    order: "asc",
  }),
});
