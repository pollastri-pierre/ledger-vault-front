//@flow
import React, { PureComponent } from "react";
import ValidateBadge from "../icons/ValidateBadge";
import _ from "lodash";
import "./index.css";

class ApprovalStatus extends PureComponent<*> {
  props: {
    approved: Array<string>,
    approvers: Array<*>,
    nbRequired: number,
    user_hash: string
  };

  render() {
    const { approved, approvers, user_hash, nbRequired } = this.props;
    const nbTotal = _.isNumber(nbRequired) ? nbRequired : approvers.length;

    const isApproved =
      approved.indexOf(user_hash) > -1 || approvers.length === approved.length;

    return (
      <span className="approval-status">
        {isApproved ? (
          <span>
            <ValidateBadge className="confirmed" /> Approved ({approved.length}{" "}
            / {approvers.length})
          </span>
        ) : (
          <span>
            Collecting Approvals ({approved.length}/{nbTotal})
          </span>
        )}
      </span>
    );
  }
}

export default ApprovalStatus;
