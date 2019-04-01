// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityTransaction } from "data/types";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";

type Props = {
  activity: ActivityEntityTransaction,
  match: Match,
};

class TransactionAbortedActivity extends Component<Props> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;

    return (
      <Text>
        <Activity match={match} activity={activity}>
          <Trans
            i18nKey="activities:transaction.abort"
            values={{
              author: business_action.author.username,
              accountName: business_action.author.username,
            }}
            components={<b>0</b>}
          />
        </Activity>
      </Text>
    );
  }
}

export default TransactionAbortedActivity;
