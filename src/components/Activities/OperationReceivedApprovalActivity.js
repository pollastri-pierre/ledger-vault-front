// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";
import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class OperationReceivedApprovalActivity extends Component<
  {
    activity: *,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  getOperationLink = (operation: Object) => {
    let link = `pending/operation/${operation.id}`;
    if (operation.status === "SUBMITTED") {
      link = `account/${operation.account_id}/operation/${operation.id}/0`;
    }
    return link;
  };

  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;

    return (
      <span>
        <NoStyleLink
          to={`/${match.params.orga_name}/${this.getOperationLink(
            business_action.operation
          )}`}
        >
          <Activity match={match} activity={activity}>
            The <Bold>operation request</Bold> created in the{" "}
            <Bold>{business_action.operation.account.name}</Bold> account has
            been approved by <Bold>{business_action.author.username} </Bold>.
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(OperationReceivedApprovalActivity);
