//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";
import Bold from "../Bold";

const styles = {};

class OperationQuorumIsReachedActivity extends Component<
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
                <Link
                    to={
                        `account/` +
                        activity.operation.account.id +
                        `/operation/` +
                        activity.operation.id +
                        `/0`
                    }
                >
                    An <Bold> operation's </Bold>
                    quorum have been reached in{" "}
                    <Bold> {activity.operation.account.name} </Bold> account.
                    Operation is now submitted.
                </Link>
            </span>
        );
    }
}

export default withStyles(styles)(OperationQuorumIsReachedActivity);
