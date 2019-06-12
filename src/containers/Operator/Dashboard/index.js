// @flow

import React, { memo } from "react";
import connectData from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";
import type { MemoryHistory } from "history";

import RequestsTable from "components/Table/RequestsTable";
import Card, {
  CardLoading,
  CardError,
  CardTitle,
  CardDesc,
} from "components/base/Card";
import Box from "components/base/Box";
import type { Request, User } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  pendingRequests: Connection<Request>,
  history: MemoryHistory,
  me: User,
};

const OperatorDashboard = memo((props: Props) => {
  const { history, pendingRequests, me } = props;

  const requests = pendingRequests.edges.map(el => el.node);
  const myFilter = request => !hasUserApprovedRequest(request, me);
  const otherFilter = request => hasUserApprovedRequest(request, me);
  const myRequests = requests.filter(myFilter);
  const otherRequests = requests.filter(otherFilter);

  const handleRowClick = (request: Request) => {
    if (
      request.target_type === "BITCOIN_LIKE_TRANSACTION" ||
      request.target_type === "ETHEREUM_LIKE_TRANSACTION"
    ) {
      history.push(
        `dashboard/transactions/details/${request.target_id}/overview`,
      );
    }
  };

  return (
    <Box flow={20}>
      <Card>
        <CardTitle noMargin i18nKey="operatorDashboard:myRequestsTitle" />
        <CardDesc i18nKey="operatorDashboard:myRequestsDesc" />
        <RequestsTable data={myRequests} onRowClick={handleRowClick} />
      </Card>
      <Card>
        <CardTitle noMargin i18nKey="operatorDashboard:otherRequestsTitle" />
        <CardDesc i18nKey="operatorDashboard:otherRequestsDesc" />
        <RequestsTable data={otherRequests} onRowClick={handleRowClick} />
      </Card>
    </Box>
  );
});

export default connectData(withMe(OperatorDashboard), {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    pendingRequests: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
    pageSize: -1,
  }),
});
