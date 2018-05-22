//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Activity from "../Activity";
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
                        A{" "}
                        <Bold>
                            new {business_action.account.currency.toUpperCase()}{" "}
                            account
                        </Bold>{" "}
                        have been created by{" "}
                        <Bold>
                            {business_action.author.first_name}{" "}
                            {business_action.author.last_name}
                        </Bold>. Account is now pending.
                    </Activity>
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(NewAccountActivity);
