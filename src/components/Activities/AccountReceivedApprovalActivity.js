// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
// import type { ActivityCommon } from "data/types";
import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class AccountReceivedApprovalActivity extends Component<
  {
    activity: *,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  getAccountLink = (account: *) => {
    let link = `pending/account/${account.id}`;
    if (account.status === "APPROVED") {
      link = `account/${account.id}`;
    }
    return link;
  };

  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;
    return (
      <span>
        <NoStyleLink
          to={`/${match.params.orga_name}/${this.getAccountLink(
            business_action.account
          )}`}
        >
          <Activity match={match} activity={activity}>
            The <Bold>{business_action.account.name}</Bold> account request has
            been approved by <Bold>{business_action.author.username} </Bold>
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(AccountReceivedApprovalActivity);
