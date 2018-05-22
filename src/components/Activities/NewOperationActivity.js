//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class NewOperationActivity extends Component<
    {
        activity: ActivityCommon,
        classes: { [_: $Keys<typeof styles>]: string },
        match: *
    },
    *
> {
    getOperationLink = (operation: *) => {
        let link = `pending/operation/${operation.id}`;
        if (operation.status === "SUBMITTED") {
            link = `account/${operation.account_id}/operation/${
                operation.id
            }/0`;
        }
        return link;
    };

    render() {
        const { activity, classes, match } = this.props;
        return (
            <span>
                <NoStyleLink
                    to={`/${match.params.orga_name}/${this.getOperationLink(
                        activity.operation
                    )}`}
                >
                    A <Bold>new operation</Bold> have been created by{" "}
                    <Bold>
                        {activity.author.first_name} {activity.author.last_name}
                    </Bold>{" "}
                    in <Bold>{activity.operation.account.name}</Bold>. Operation
                    is now pending.
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(NewOperationActivity);
