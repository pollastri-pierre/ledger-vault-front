//@flow
import React, { Component } from "react";

import AccountQuorumIsReachedActivity from "../Activities/AccountQuorumIsReachedActivity";
import AccountReceivedApprovalActivity from "../Activities/AccountReceivedApprovalActivity";
import NewAccountActivity from "../Activities/NewAccountActivity";
import NewOperationActivity from "../Activities/NewOperationActivity";
import OperationQuorumIsReachedActivity from "../Activities/OperationQuorumIsReachedActivity";
import OperationReceivedApprovalActivity from "../Activities/OperationReceivedApprovalActivity";

class ActivityFactory extends Component<> {
    static build(data, match) {
        switch (data.business_action_name) {
            case "OPERATION_CREATED_BUSINESS_ACTION":
                return <NewOperationActivity activity={data} match={match} />;
            case "OPERATION_RECEIVED_APPROVAL_BUSINESS_ACTION":
                return (
                    <OperationReceivedApprovalActivity
                        activity={data}
                        match={match}
                    />
                );
            case "OPERATION_QUORUM_IS_REACHED_BUSINESS_ACTION":
                return (
                    <OperationQuorumIsReachedActivity
                        activity={data}
                        match={match}
                    />
                );
            case "ACCOUNT_QUORUM_IS_REACHED_BUSINESS_ACTION":
                return (
                    <AccountQuorumIsReachedActivity
                        activity={data}
                        match={match}
                    />
                );
            case "ACCOUNT_RECEIVED_NEW_APPROVAL_BUSINESS_ACTION":
                return (
                    <AccountReceivedApprovalActivity
                        activity={data}
                        match={match}
                    />
                );
            case "ACCOUNT_CREATED_BUSINESS_ACTION":
                return <NewAccountActivity activity={data} match={match} />;
            default:
                return <span>{data.message}</span>;
        }
    }
}

export default ActivityFactory;
