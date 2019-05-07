// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";

import connectData from "restlay/connectData";
import { VISIBLE_MENU_STATUS } from "utils/accounts";
import AccountQuery from "api/queries/AccountQuery";
import type { Account } from "data/types";

import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import Card, { CardLoading, CardError } from "components/base/Card";

import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastTransactionsCard from "./AccountLastTransactionsCard";
import AccountQuickInfo from "./AccountQuickInfo";
import SubAccounts from "./SubAccounts";

type Props = {
  account: Account,
  match: {
    url: string,
    params: {
      id: string,
    },
  },
};

class AccountView extends Component<Props> {
  render() {
    const { match, account } = this.props;
    const accountId = match.params.id;

    let inner = null;

    if (account.status && VISIBLE_MENU_STATUS.indexOf(account.status) === -1) {
      inner = (
        <Card>
          <Label>Account pending</Label>
          <InfoBox withIcon type="info">
            <Text>
              <Trans i18nKey="accountView:approved" components={<b>0</b>} />
            </Text>
          </InfoBox>
        </Card>
      );
    } else {
      inner = (
        <Box flow={20}>
          <Box horizontal flow={20}>
            <AccountQuickInfo account={account} match={match} />
            <AccountBalanceCard account={account} />
          </Box>
          {account.account_type === "Ethereum" && (
            <SubAccounts account={account} />
          )}
          <AccountLastTransactionsCard key={accountId} account={account} />
        </Box>
      );
    }

    return inner;
  }
}

export default connectData(AccountView, {
  queries: {
    account: AccountQuery,
  },
  RenderError: CardError,
  RenderLoading: CardLoading,
  optimisticRendering: true,
  propsToQueryParams: ({ match }: { match: * }) => ({
    accountId: match.params.id,
  }),
});
