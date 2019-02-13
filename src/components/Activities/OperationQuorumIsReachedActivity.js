// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import type { ActivityEntityOperation } from "data/types";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";
import NoStyleLink from "../NoStyleLink";

type Props = {
  activity: ActivityEntityOperation,
  match: Match
};

class OperationQuorumIsReachedActivity extends Component<Props> {
  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;
    // TODO: update links
    return (
      <Text>
        <NoStyleLink
          to={
            match.params.orga_name &&
            `/${match.params.orga_name}/account/${
              business_action.operation.account.id
            }/operation/${business_action.operation.id}/0`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:operation.quorumReached"
              values={{
                approvalNumber:
                  business_action.operation.account.number_of_approvals,
                accountName: business_action.operation.account.name
              }}
              components={<b>0</b>}
            />
          </Activity>
        </NoStyleLink>
      </Text>
    );
  }
}

export default OperationQuorumIsReachedActivity;
