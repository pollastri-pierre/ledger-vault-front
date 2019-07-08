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
class NewTransactionActivity extends Component<Props> {
  getTransactionLink = (transaction: *) => {
    let link = `admin/tasks`;
    if (transaction.status === "SUBMITTED") {
      // TODO update with transaction view link
      link = `account/${transaction.account_id}/transaction/${transaction.id}/overview`;
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
            `/${match.params.orga_name}/${this.getTransactionLink(
              business_action.transaction,
            )}`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:transaction.requestCreated"
              values={{
                author: business_action.author.username,
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

export default NewTransactionActivity;
