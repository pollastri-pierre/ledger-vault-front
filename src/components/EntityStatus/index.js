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
  size?: "big" | "normal",
};

class EntityStatus extends PureComponent<Props> {
  render() {
    const { status, me, request, size } = this.props;

    if (!request) {
      return <Status status={status} size={size} />;
    }

    const isRequestBlocked = request.status === "BLOCKED";
    const shouldDisplayBlockedStatus = isRequestBlocked && status !== "ACTIVE";

    if (!request.approvals && !shouldDisplayBlockedStatus) {
      return (
        <Status size={size} status={remapStatus(status, request.target_type)} />
      );
    }
    if (shouldDisplayBlockedStatus) {
      return <Status size={size} status="BLOCKED" />;
    }

    const isWaitingForApproval =
      !hasUserApprovedRequest(request, me) && status !== "ACTIVE";

    return (
      <Box horizontal flow={10} align="center">
        <Status
          size={size}
          status={
            isWaitingForApproval
              ? "AWAITING_APPROVAL"
              : shouldDisplayBlockedStatus
              ? "BLOCKED"
              : status
          }
        />
        <RequestExpirationDate expirationDate={request.expired_at} />
      </Box>
    );
  }
}

export function remapStatus(status: string, targetType: string) {
  // we want to display "deleted" instead of "revoked" for groups
  if (targetType === "GROUP" && status === "REVOKED") {
    return "DELETED";
  }
  return status;
}

export { EntityStatus };
export default withMe(EntityStatus);
