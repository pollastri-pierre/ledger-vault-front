//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import Bold from "../Bold";

const styles = {};

class AccountQuorumIsReachedActivity extends Component<
    {
        activity: ActivityCommon,
        classes: { [_: $Keys<typeof styles>]: string }
    },
    *
> {
    render() {
        const { activity, classes } = this.props;

        return (
            <span>
                <Link to={`account/` + activity.account.id}>
                    <Bold>
                        {activity.account.currency.toUpperCase()} account{" "}
                        {activity.account.name}
                    </Bold>{" "}
                    quorum have been reached. Account is now approved.
                </Link>
            </span>
        );
    }
}

export default withStyles(styles)(AccountQuorumIsReachedActivity);
