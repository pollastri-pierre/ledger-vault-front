//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";
import Activity from "../Activity";
import Bold from "../Bold";

const styles = {};

class AccountHasBeenActivatedActivity extends Component<
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
          The <Bold>{business_action.account.name}</Bold> account is now active.
        </Activity>
      </span>
    );
  }
}

export default withStyles(styles)(AccountHasBeenActivatedActivity);
