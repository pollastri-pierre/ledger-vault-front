//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";
import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class OperationAbortedActivity extends Component<
  {
    activity: *,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;

    return (
      <span>
        <Activity match={match} activity={activity}>
          The operation request created in{" "}
          <Bold>{business_action.operation.account.name}</Bold> has been aborted
          by{" "}
          <Bold>
            {business_action.author.first_name}{" "}
            {business_action.author.last_name}
          </Bold>.
        </Activity>
      </span>
    );
  }
}

export default withStyles(styles)(OperationAbortedActivity);
