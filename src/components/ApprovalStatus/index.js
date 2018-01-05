//@flow
import React, { PureComponent } from "react";
import ValidateBadge from "../icons/full/ValidateBadge";
import { withStyles } from "material-ui/styles";
import type { Member } from "../../data/types";
import { calculateApprovingObjectMeta } from "../../data/approvingObject";
import colors from "../../shared/colors";
import type {
  ApprovingObject,
  ApprovingObjectMeta
} from "../../data/approvingObject";

const styles = {
  badge: {
    width: 11,
    verticalAlign: "middle",
    marginRight: 7,
    fill: colors.ocean
  }
};

class ApprovalStatus extends PureComponent<{
  approved: Array<string>,
  approvers: Array<*>,
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
              <ValidateBadge className={classes.badge} />
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

export default withStyles(styles)(ApprovalStatus);
