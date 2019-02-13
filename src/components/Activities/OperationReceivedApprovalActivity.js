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

class OperationReceivedApprovalActivity extends Component<Props> {
  getOperationLink = (operation: Object) => {
    // TODO: update links when available
    let link = `admin/tasks`;
    if (operation.status === "SUBMITTED") {
      link = `account/${operation.account_id}/operation/${operation.id}/0`;
    }
    return link;
  };

  render() {
    const { activity, match } = this.props;
    const business_action = activity.business_action;

    return (
      <Text>
        <NoStyleLink
          to={
            match.params.orga_name &&
            `/${match.params.orga_name}/${this.getOperationLink(
              business_action.operation
            )}`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:opeartion.approved"
              values={{
                author: business_action.author.username,
                accountName: business_action.author.username
              }}
              components={<b>0</b>}
            />
          </Activity>
        </NoStyleLink>
      </Text>
    );
  }
}

export default OperationReceivedApprovalActivity;
