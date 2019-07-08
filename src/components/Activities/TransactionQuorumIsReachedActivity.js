// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityTransaction } from "data/types";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";
import NoStyleLink from "../NoStyleLink";

type Props = {
  activity: ActivityEntityTransaction,
  match: Match,
};

class TransactionQuorumIsReachedActivity extends Component<Props> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;
    // TODO: update links
    return (
      <Text>
        <NoStyleLink
          to={
            match.params.orga_name &&
            `/${match.params.orga_name}/accounts/${business_action.transaction.account.id}/transaction/${business_action.transaction.id}/overview`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:transaction.quorumReached"
              values={{
                approvalNumber:
                  business_action.transaction.account.number_of_approvals,
                accountName: business_action.transaction.account.name,
              }}
              components={<b>0</b>}
            />
          </Activity>
        </NoStyleLink>
      </Text>
    );
  }
}

export default TransactionQuorumIsReachedActivity;
