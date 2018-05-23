//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class AccountQuorumIsReachedActivity extends Component<
  {
    activity: ActivityCommon,
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
        <NoStyleLink
          to={`/${match.params.orga_name}/account/${
            business_action.account.id
          }`}
        >
          <Activity match={match} activity={activity}>
            <Bold>
              {business_action.account.currency.toUpperCase()} account{" "}
              {business_action.account.name}
            </Bold>{" "}
            quorum have been reached. Account is now approved.
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(AccountQuorumIsReachedActivity);
