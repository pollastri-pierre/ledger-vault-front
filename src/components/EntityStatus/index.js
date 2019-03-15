// @flow

import React, { PureComponent } from "react";
import Status from "components/Status";
import { withMe } from "components/UserContextProvider";
import type { Member, Request } from "data/types";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  status: string,
  request: ?Request,
  me: Member,
};

class EntityStatus extends PureComponent<Props> {
  render() {
    const { status, me, request } = this.props;
    if (!request || !request.approvals) {
      return <Status status={status} />;
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

export { EntityStatus };
export default withMe(EntityStatus);
