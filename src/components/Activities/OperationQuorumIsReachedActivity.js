//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class OperationQuorumIsReachedActivity extends Component<
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
                        activity.operation.account.id
                    }/operation/${activity.operation.id}/0`}
                >
                    An <Bold> operation's </Bold>
                    quorum have been reached in{" "}
                    <Bold> {activity.operation.account.name} </Bold> account.
                    Operation is now submitted.
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(OperationQuorumIsReachedActivity);
