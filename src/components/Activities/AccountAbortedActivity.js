//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";
import Activity from "../Activity";
import Bold from "../Bold";

const styles = {};

class AccountAbortedActivity extends Component<
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
          The <Bold>{business_action.account.name}</Bold> account request has
          been aborted by <Bold>{business_action.author.username} </Bold>.
        </Activity>
      </span>
    );
  }
}

export default withStyles(styles)(AccountAbortedActivity);
