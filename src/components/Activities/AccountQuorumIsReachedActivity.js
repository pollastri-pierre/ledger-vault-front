//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import type { ActivityEntityAccount } from "data/types";

import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class AccountQuorumIsReachedActivity extends Component<
  {
    activity: ActivityEntityAccount,
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
            The <Bold>{business_action.account.name}</Bold> account request has
            been approved by{" "}
            <Bold>
              {business_action.account.number_of_approvals} out of{" "}
              {business_action.account.number_of_approvals} Administrators.
            </Bold>{" "}
            The account is now created in your workspace.
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(AccountQuorumIsReachedActivity);
