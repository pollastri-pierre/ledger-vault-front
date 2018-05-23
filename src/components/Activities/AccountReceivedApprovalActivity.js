//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class AccountReceivedApprovalActivity extends Component<
  {
    activity: ActivityCommon,
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
            An <Bold>account</Bold> received a new approval by{" "}
            <Bold>
              {business_action.author.first_name}{" "}
              {business_action.author.last_name}
            </Bold>
          </Activity>
        </NoStyleLink>
      </span>
    );
  }
}

export default withStyles(styles)(AccountReceivedApprovalActivity);
