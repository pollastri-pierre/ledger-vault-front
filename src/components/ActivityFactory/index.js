//@flow
import React, { Component } from "react";

import AccountQuorumIsReachedActivity from "../Activities/AccountQuorumIsReachedActivity";
import AccountReceivedApprovalActivity from "../Activities/AccountReceivedApprovalActivity";
import Activity from "../Activity";
import NewAccountActivity from "../Activities/NewAccountActivity";
import NewOperationActivity from "../Activities/NewOperationActivity";
import OperationQuorumIsReachedActivity from "../Activities/OperationQuorumIsReachedActivity";
import OperationReceivedApprovalActivity from "../Activities/OperationReceivedApprovalActivity";

class ActivityFactory extends Component<> {
    static build(activity, match) {
        console.log(activity);
        switch (activity.business_action.business_action_name) {
            case "OPERATION_CREATED_BUSINESS_ACTION":
                return (
                    <NewOperationActivity activity={activity} match={match} />
                );
            case "OPERATION_RECEIVED_APPROVAL_BUSINESS_ACTION":
                return (
                    <OperationReceivedApprovalActivity
                        activity={activity}
                        match={match}
                    />
                );
            case "OPERATION_QUORUM_IS_REACHED_BUSINESS_ACTION":
                return (
                    <OperationQuorumIsReachedActivity
                        activity={activity}
                        match={match}
                    />
                );
            case "ACCOUNT_QUORUM_IS_REACHED_BUSINESS_ACTION":
                return (
                    <AccountQuorumIsReachedActivity
                        activity={activity}
                        match={match}
                    />
                );
            case "ACCOUNT_RECEIVED_NEW_APPROVAL_BUSINESS_ACTION":
                return (
                    <AccountReceivedApprovalActivity
                        activity={activity}
                        match={match}
                    />
                );
            case "ACCOUNT_CREATED_BUSINESS_ACTION":
                return <NewAccountActivity activity={activity} match={match} />;
            default:
                return (
                    <Activity match={match} activity={activity}>
                        <span>{activity.message}</span>
                    </Activity>
                );
        }
    }
}

export default ActivityFactory;
