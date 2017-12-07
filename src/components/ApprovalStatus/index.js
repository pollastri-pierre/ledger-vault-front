//@flow
import React, { PureComponent } from "react";
import ValidateBadge from "../icons/ValidateBadge";
import type { Member } from "../../data/types";
import { calculateApprovingObjectMeta } from "../../data/approvingObject";
import type {
  ApprovingObject,
  ApprovingObjectMeta
} from "../../data/approvingObject";

class ApprovalStatus extends PureComponent<{
  approved: Array<string>,
  approvers: Array<*>,
  nbRequired: number,
  user: Member,
  approvingObject?: ApprovingObject
}> {
  render() {
    const {
      approvingObject,
      approved,
      approvers,
      user,
      nbRequired
    } = this.props;

    const isUserApproved =
      approved.indexOf(user.pub_key) > -1 ||
      approvers.length === approved.length;

    const approvingObjectMeta: ?ApprovingObjectMeta =
      approvingObject && calculateApprovingObjectMeta(approvingObject);

    return (
      <span className="approval-status">
        {isUserApproved ? (
          approved.length === approvers.length && approvingObjectMeta ? (
            <span>{approvingObjectMeta.globalEndTextRemaining}</span>
          ) : (
            <span>
              <ValidateBadge className="confirmed" />
              Approved ({approved.length}/{approvers.length})
            </span>
          )
        ) : (
          <span>
            Collecting Approvals ({approved.length}/{nbRequired})
          </span>
        )}
      </span>
    );
  }
}

export default ApprovalStatus;
