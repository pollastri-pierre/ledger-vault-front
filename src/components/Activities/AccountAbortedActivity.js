// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityAccount } from "data/types";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";

type Props = {
  activity: ActivityEntityAccount,
  match: Match,
};

class AccountAbortedActivity extends Component<Props> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;

    return (
      <Text>
        <Activity match={match} activity={activity}>
          <Trans
            i18nKey="activities:account.abort"
            values={{
              accountName: business_action.account.name,
              author: business_action.author.username,
            }}
            components={<b>0</b>}
          />
        </Activity>
      </Text>
    );
  }
}

export default AccountAbortedActivity;
