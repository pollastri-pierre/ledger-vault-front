// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Activity from "../Activity";
import Bold from "../Bold";

const styles = {};

class AccountSecuritySchemeHasBeenProvidedActivity extends Component<
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
          The operation rules of the <Bold>{business_action.account.name}</Bold>{" "}
          account have been provided.
        </Activity>
      </span>
    );
  }
}

export default withStyles(styles)(AccountSecuritySchemeHasBeenProvidedActivity);
