// @flow

import React, { PureComponent } from "react";
import Status from "components/Status";
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
      <Status
        withWarning={isWaitingForApproval}
        status={isWaitingForApproval ? "AWAITING_APPROVAL" : status}
      />
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
