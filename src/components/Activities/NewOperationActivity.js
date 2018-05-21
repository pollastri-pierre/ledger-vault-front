//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import Bold from "../Bold";

const styles = {};

class NewOperationActivity extends Component<
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
                <Link to={`pending/operation/` + activity.operation.id}>
                    A <Bold>new operation</Bold> have been created by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>{" "}
                    in <Bold>{activity.operation.account.name}</Bold>. Operation
                    is now pending.
                </Link>
            </span>
        );
    }
}

export default withStyles(styles)(NewOperationActivity);
