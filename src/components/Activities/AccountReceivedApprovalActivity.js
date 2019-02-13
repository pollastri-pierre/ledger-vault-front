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
  match: Match
};

class AccountReceivedApprovalActivity extends Component<Props> {
  getAccountLink = (account: *) => {
    let link = `admin/pending/account/${account.id}`;
    if (account.status === "APPROVED") {
      link = `admin/account/${account.id}`;
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
            `/${match.params.orga_name}/${this.getAccountLink(
              business_action.account
            )}`
          }
        >
          <Activity match={match} activity={activity}>
            <Trans
              i18nKey="activities:account.approved"
              values={{
                accountName: business_action.account.name,
                author: business_action.author.username
              }}
              components={<b>0</b>}
            />
          </Activity>
        </NoStyleLink>
      </Text>
    );
  }
}

export default AccountReceivedApprovalActivity;
