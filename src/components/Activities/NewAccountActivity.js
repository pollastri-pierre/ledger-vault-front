//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class NewAccountActivity extends Component<
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
                    A{" "}
                    <Bold>
                        new {activity.account.currency.toUpperCase()} account
                    </Bold>{" "}
                    have been created by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>. Account is now pending.
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(NewAccountActivity);
