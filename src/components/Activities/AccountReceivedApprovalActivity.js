//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

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
        const { activity, classes, match } = this.props;

        return (
            <span>
                <NoStyleLink
                    to={`/${match.params.orga_name}/${this.getAccountLink(
                        activity.account
                    )}`}
                >
                    An <Bold>account</Bold> received a new approval by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(AccountReceivedApprovalActivity);
