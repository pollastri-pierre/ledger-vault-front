//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";

import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class OperationQuorumIsReachedActivity extends Component<
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
        <NoStyleLink
          to={`/${match.params.orga_name}/account/${business_action.operation
            .account.id}/operation/${business_action.operation.id}/0`}
        >
          <Activity match={match} activity={activity}>
            An <Bold> operation&#39;s </Bold>
            quorum have been reached in{" "}
            <Bold> {business_action.operation.account.name} </Bold> account.
            Operation is now submitted.
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(OperationQuorumIsReachedActivity);
