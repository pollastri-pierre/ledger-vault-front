//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import Bold from "../Bold";

const styles = {};

class AccountReceivedApprovalActivity extends Component<
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
                    An <Bold>account</Bold> received a new approval by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>
                </Link>
            </span>
        );
    }
}

export default withStyles(styles)(AccountReceivedApprovalActivity);
