// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityAccount } from "data/types";
import Text from "components/base/Text";
import { getCurrentStepProgress } from "utils/request";
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
    if (!business_action.account.last_request) return null;
    const progress = getCurrentStepProgress(
      business_action.account.last_request,
    );
    if (!progress) return null;
    return (
      <Text>
        <NoStyleLink
          to={
            match.params.orga_name &&
            `/${match.params.orga_name}/admin/accounts/${business_action.account.id}`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:account.quorumReached"
              values={{
                accountName: business_action.account.name,
                approvalNumber: progress.nb,
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
