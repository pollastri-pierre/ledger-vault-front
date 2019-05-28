// @flow

import React, { PureComponent } from "react";
import Status from "components/Status";
import RequestExpirationDate from "components/RequestExpirationDate";
import Box from "components/base/Box";
import { withMe } from "components/UserContextProvider";
import type { User, Request } from "data/types";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  status: string,
  request: ?Request,
  me: User,
};

class EntityStatus extends PureComponent<Props> {
  render() {
    const { status, me, request } = this.props;

    if (!request) {
      return <Status status={status} />;
    }

    if (!request.approvals) {
      return <Status status={remapStatus(status, request.target_type)} />;
    }

    const isWaitingForApproval =
      !hasUserApprovedRequest(request, me) && status !== "ACTIVE";

    return (
      <Box horizontal flow={10} align="center">
        <Status
          withWarning={isWaitingForApproval}
          status={isWaitingForApproval ? "AWAITING_APPROVAL" : status}
        />
        <RequestExpirationDate expirationDate={request.expired_at} />
      </Box>
    );
  }
}

function remapStatus(status: string, targetType: string) {
  // we want to display "deleted" instead of "revoked" for groups
  if (targetType === "GROUP" && status === "REVOKED") {
    return "DELETED";
  }
  return status;
}

export { EntityStatus };
export default withMe(EntityStatus);
