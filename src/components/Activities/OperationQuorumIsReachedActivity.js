// @flow
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
          to={`/${match.params.orga_name}/account/${
            business_action.operation.account.id
          }/operation/${business_action.operation.id}/0`}
        >
          <Activity match={match} activity={activity}>
            The operation created in{" "}
            <Bold> {business_action.operation.account.name} </Bold> has been
            approved by{" "}
            <Bold>
              {business_action.operation.account.number_of_approvals} out of{" "}
              {business_action.operation.account.number_of_approvals} members
            </Bold>. The operation has been broadcasted to the blockchain
            network.
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(OperationQuorumIsReachedActivity);
