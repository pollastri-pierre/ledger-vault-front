//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import Bold from "../Bold";

const styles = {};

class NewAccountActivity extends Component<
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
                <Link to={`pending/account/` + activity.account.id}>
                    A{" "}
                    <Bold>
                        new {activity.account.currency.toUpperCase()} account
                    </Bold>{" "}
                    have been created by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>. Account is now pending.
                </Link>
            </span>
        );
    }
}

export default withStyles(styles)(NewAccountActivity);
