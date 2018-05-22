//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

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
        const { activity, classes, match } = this.props;

        return (
            <span>
                <NoStyleLink
                    to={`/${match.params.orga_name}/account/${
                        activity.account.id
                    }`}
                >
                    <Bold>
                        {activity.account.currency.toUpperCase()} account{" "}
                        {activity.account.name}
                    </Bold>{" "}
                    quorum have been reached. Account is now approved.
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(AccountQuorumIsReachedActivity);
