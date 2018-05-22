//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import Activity from "../Activity";
import Bold from "../Bold";
import NoStyleLink from "../NoStyleLink";

const styles = {};

class OperationReceivedApprovalActivity extends Component<
    {
        activity: ActivityCommon,
        classes: { [_: $Keys<typeof styles>]: string },
        match: *
    },
    *
> {
    getOperationLink = (operation: *) => {
        let link = `pending/${operation}/${operation.id}`;
        if (operation.status === "SUBMITTED") {
            link = `account/${operation.account_id}/operation/${
                operation.id
            }/0`;
        }
        return link;
    };

    render() {
        const { activity, match } = this.props;
        const business_action = activity.business_action;

        return (
            <span>
                <NoStyleLink
                    to={`/${match.params.orga_name}/${this.getOperationLink(
                        business_action.operation
                    )}`}
                >
                    <Activity match={match} activity={activity}>
                        An <Bold>operation</Bold> received a new approval by{" "}
                        <Bold>
                            {business_action.author.first_name}{" "}
                            {business_action.author.last_name}
                        </Bold>{" "}
                        in <Bold>{business_action.operation.account.name}</Bold>
                    </Activity>
                </NoStyleLink>
            </span>
        );
    }
}

export default withStyles(styles)(OperationReceivedApprovalActivity);
