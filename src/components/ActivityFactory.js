// @flow
import React, { Component } from "react";

import AccountAbortedActivity from "./Activities/AccountAbortedActivity";
import AccountQuorumIsReachedActivity from "./Activities/AccountQuorumIsReachedActivity";
import AccountReceivedApprovalActivity from "./Activities/AccountReceivedApprovalActivity";
import NewIncomingTransactionActivity from "./Activities/NewIncomingTransactionActivity";
import TransactionAbortedActivity from "./Activities/TransactionAbortedActivity";
import Activity from "./legacy/Activity";
import NewAccountActivity from "./Activities/NewAccountActivity";
import NewTransactionActivity from "./Activities/NewTransactionActivity";
import TransactionQuorumIsReachedActivity from "./Activities/TransactionQuorumIsReachedActivity";
import TransactionReceivedApprovalActivity from "./Activities/TransactionReceivedApprovalActivity";
import AccountHasBeenActivatedActivity from "./Activities/AccountHasBeenActivatedActivity";
import AccountSecuritySchemeHasBeenProvidedActivity from "./Activities/AccountSecuritySchemeHasBeenProvidedActivity";

class ActivityFactory extends Component<*, *> {
  static build(activity: *, match: *) {
    switch (activity.business_action.name) {
      case "OPERATION_CREATED":
        return <NewTransactionActivity activity={activity} match={match} />;
      case "OPERATION_RECEIVED_APPROVAL":
        return (
          <TransactionReceivedApprovalActivity
            activity={activity}
            match={match}
          />
        );
      case "OPERATION_QUORUM_IS_REACHED":
        return (
          <TransactionQuorumIsReachedActivity
            activity={activity}
            match={match}
          />
        );
      case "OPERATION_ABORTED":
        return <TransactionAbortedActivity activity={activity} match={match} />;
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
      case "ACCOUNT_HAS_BEEN_ACTIVATED":
        return (
          <AccountHasBeenActivatedActivity activity={activity} match={match} />
        );
      case "ACCOUNT_SECURITY_SCHEME_HAS_BEEN_PROVIDED":
        return (
          <AccountSecuritySchemeHasBeenProvidedActivity
            activity={activity}
            match={match}
          />
        );
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
