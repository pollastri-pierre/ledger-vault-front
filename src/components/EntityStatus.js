// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "styled-components";
import Status from "components/Status";
import RequestExpirationDate from "components/RequestExpirationDate";
import Box from "components/base/Box";
import { withMe } from "components/UserContextProvider";
import type { User, GenericRequest } from "data/types";
import { hasUserApprovedRequest, isUserInCurrentStep } from "utils/request";
import { Badge } from "containers/Admin/Dashboard/PendingBadge";

type Props = {
  status: string,
  request: ?GenericRequest,
  useRequestStatus?: boolean,
  me: User,
  size?: "big" | "normal",
};

// gate has a weird status management
const APPROVED_LIKE_STATUS = ["SUBMITTED", "ACTIVE", "MIGRATED", "VIEW_ONLY"];

class EntityStatus extends PureComponent<Props> {
  render() {
    const { status, me, request, size, useRequestStatus } = this.props;

    if (!request) {
      return <Status status={status} size={size} />;
    }

    const isRequestBlocked = request.status === "BLOCKED";
    const shouldDisplayBlockedStatus =
      isRequestBlocked && !APPROVED_LIKE_STATUS.includes(status);

    if (useRequestStatus && APPROVED_LIKE_STATUS.includes(request.status)) {
      return <Status size={size} status="APPROVED" />;
    }
    if (!request.approvals && !shouldDisplayBlockedStatus) {
      return (
        <Status size={size} status={remapStatus(status, request.target_type)} />
      );
    }
    if (shouldDisplayBlockedStatus) {
      return <Status size={size} status="BLOCKED" />;
    }

    const shouldDisplayDot =
      request.status === "PENDING_APPROVAL" &&
      APPROVED_LIKE_STATUS.includes(status);

    const isWaitingForApproval =
      !hasUserApprovedRequest(request, me) &&
      isUserInCurrentStep(request, me) &&
      status !== "ACTIVE";

    const inner = (
      <Box horizontal flow={5} align="center" inline>
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
        {shouldDisplayDot && <Dot />}
        <RequestExpirationDate expirationDate={request.expired_at} />
      </Box>
    );

    if (shouldDisplayDot) {
      return (
        <Tooltip
          title={
            <Trans
              i18nKey={`request:statusDot.${request.type}`}
              components={<b>0</b>}
            />
          }
          placement="top-start"
        >
          {inner}
        </Tooltip>
      );
    }

    return inner;
  }
}

export function remapStatus(status: string, targetType: string) {
  // we want to display "deleted" instead of "revoked" for groups
  if (targetType === "GROUP" && status === "REVOKED") {
    return "DELETED";
  }
  return status;
}

const Dot = styled(Badge)`
  min-width: 10px !important;
  height: 10px;
`;

export { EntityStatus };
export default withMe(EntityStatus);
