// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import Text from "components/base/Text";
import Activity from "../legacy/Activity";
import NoStyleLink from "../NoStyleLink";

type Props = {
  activity: Object,
  match: Match
};

class NewIncomingTransactionActivity extends Component<Props> {
  getOperationLink = (operation: *) => {
    let link = `pending/operation/${operation.id}`;
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
          to={`/${match.params.orga_name}/${this.getOperationLink(
            business_action.operation
          )}`}
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:account.txReceived"
              values={{
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

export default NewIncomingTransactionActivity;
