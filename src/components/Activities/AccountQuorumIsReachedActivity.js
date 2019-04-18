// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityAccount } from "data/types";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";
import NoStyleLink from "../NoStyleLink";

type Props = {
  activity: ActivityEntityAccount,
  match: Match,
};

class AccountQuorumIsReachedActivity extends Component<Props> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;
    return (
      <Text>
        <NoStyleLink
          to={
            match.params.orga_name &&
            `/${match.params.orga_name}/admin/accounts/${
              business_action.account.id
            }`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:account.quorumReached"
              values={{
                accountName: business_action.account.name,
                approvalNumber: business_action.account.number_of_approvals,
              }}
              components={<b>0</b>}
            />
          </Activity>
        </NoStyleLink>
      </Text>
    );
  }
}

export default AccountQuorumIsReachedActivity;
