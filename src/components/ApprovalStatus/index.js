// @flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Member, Approval } from "data/types";
import { calculateApprovingObjectMeta } from "data/approvingObject";
import colors from "shared/colors";
import type {
  ApprovingObject,
  ApprovingObjectMeta
} from "data/approvingObject";
import ValidateBadge from "../icons/full/ValidateBadge";

const styles = {
  badge: {
    width: 11,
    verticalAlign: "middle",
    marginRight: 7,
    fill: colors.ocean
  }
};

class ApprovalStatus extends PureComponent<{
  approved: Approval[],
  approvers: Member[],
  nbRequired: number,
  user: Member,
  approvingObject?: ApprovingObject,
  classes: Object
}> {
  render() {
    const {
      approvingObject,
      approved,
      approvers,
      user,
      nbRequired,
      classes
    } = this.props;

    const isUserApproved =
      approved.filter(approval => approval.person.pub_key === user.pub_key)
        .length > 0;

    const approvingObjectMeta: ?ApprovingObjectMeta =
      approvingObject && calculateApprovingObjectMeta(approvingObject);

    return (
      <span className="approval-status">
        {isUserApproved ? (
          approved.length === approvers.length && approvingObjectMeta ? (
            <span>{approvingObjectMeta.globalEndTextRemaining}</span>
          ) : (
            <span>
              <ValidateBadge className={classes.badge} />
              Approved ({approved.length}/{nbRequired || approvers.length})
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

export default withStyles(styles)(ApprovalStatus);
