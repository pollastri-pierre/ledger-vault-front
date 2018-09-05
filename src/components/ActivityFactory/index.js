//@flow
import React, { Component } from "react";

import AccountAbortedActivity from "../Activities/AccountAbortedActivity";
import AccountQuorumIsReachedActivity from "../Activities/AccountQuorumIsReachedActivity";
import AccountReceivedApprovalActivity from "../Activities/AccountReceivedApprovalActivity";
import NewIncomingTransactionActivity from "../Activities/NewIncomingTransactionActivity";
import OperationAbortedActivity from "../Activities/OperationAbortedActivity";
import Activity from "../Activity";
import NewAccountActivity from "../Activities/NewAccountActivity";
import NewOperationActivity from "../Activities/NewOperationActivity";
import OperationQuorumIsReachedActivity from "../Activities/OperationQuorumIsReachedActivity";
import OperationReceivedApprovalActivity from "../Activities/OperationReceivedApprovalActivity";

class ActivityFactory extends Component<*, *> {
  static build(activity: *, match: *) {
    console.log(activity.business_action);
    switch (activity.business_action.name) {
      case "OPERATION_CREATED":
        return <NewOperationActivity activity={activity} match={match} />;
      case "OPERATION_RECEIVED_APPROVAL":
        return (
          <OperationReceivedApprovalActivity
            activity={activity}
            match={match}
          />
        );
      case "OPERATION_QUORUM_IS_REACHED":
        return (
          <OperationQuorumIsReachedActivity activity={activity} match={match} />
        );
      case "OPERATION_ABORTED":
        return <OperationAbortedActivity activity={activity} match={match} />;
      case "NEW_INCOMING_OPERATION":
        return (
          <NewIncomingTransactionActivity activity={activity} match={match} />
        );
      case "ACCOUNT_QUORUM_IS_REACHED":
        return (
          <AccountQuorumIsReachedActivity activity={activity} match={match} />
        );
      case "ACCOUNT_RECEIVED_NEW_APPROVAL":
        return (
          <AccountReceivedApprovalActivity activity={activity} match={match} />
        );
      case "ACCOUNT_CREATED":
        return <NewAccountActivity activity={activity} match={match} />;
      case "ACCOUNT_ABORTED":
        return <AccountAbortedActivity activity={activity} match={match} />;
      default:
        return (
          <Activity match={match} activity={activity}>
            <span>{activity.business_action.message}</span>
          </Activity>
        );
    }
  }
}

export default ActivityFactory;
