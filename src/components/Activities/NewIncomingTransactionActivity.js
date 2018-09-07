//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Activity from "../Activity";
// import type { ActivityCommon } from "data/types";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class NewIncomingTransactionActivity extends Component<
  {
    activity: *,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  getOperationLink = (operation: *) => {
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
            A <Bold>payment</Bold> has been received in the{" "}
            <Bold>{business_action.operation.account.name}</Bold> account
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(NewIncomingTransactionActivity);
