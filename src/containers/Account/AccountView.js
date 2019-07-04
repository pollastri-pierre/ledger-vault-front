// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import type { Location } from "react-router-dom";

import connectData from "restlay/connectData";
import AccountQuery from "api/queries/AccountQuery";
import type { Account, User } from "data/types";

import { withMe } from "components/UserContextProvider";
import VaultLink from "components/VaultLink";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { Label } from "components/base/form";
import Card, { CardLoading, CardError } from "components/base/Card";
import { hasUserApprovedRequest } from "utils/request";
import { isBalanceAvailable } from "utils/accounts";

import AccountBalanceCard from "./AccountBalanceCard";
import AccountLastTransactionsCard from "./AccountLastTransactionsCard";
import AccountQuickInfo from "./AccountQuickInfo";
import SubAccounts from "./SubAccounts";

type Props = {
  location: Location,
  account: Account,
  me: User,
  match: {
    url: string,
    params: {
      id: string,
    },
  },
};

class AccountView extends Component<Props> {
  render() {
    const { match, account, me, location } = this.props;
    const accountId = match.params.id;

    const showPendingBox =
      account.last_request && account.status.startsWith("PENDING");
    const hasApprovedRequest =
      account.last_request && hasUserApprovedRequest(account.last_request, me);

    return (
      <Box flow={20}>
        <Box horizontal flow={20}>
          <AccountQuickInfo account={account} match={match} />
          {isBalanceAvailable(account) && (
            <AccountBalanceCard account={account} />
          )}
        </Box>
        {showPendingBox && (
          <Card>
            <Label>Account pending</Label>
            <InfoBox withIcon type="info">
              <Text>
                {hasApprovedRequest ? (
                  <Trans
                    i18nKey="accountView:need_approval_by_other"
                    components={<VaultLink to="/admin/dashboard">0</VaultLink>}
                  />
                ) : (
                  <Trans
                    i18nKey="accountView:need_approval_by_me"
                    components={
                      <Link
                        to={`${location.pathname}/accounts/details/${account.id}/overview`}
                      >
                        0
                      </Link>
                    }
                  />
                )}
              </Text>
            </InfoBox>
          </Card>
        )}
        {account.account_type === "Ethereum" && (
          <SubAccounts account={account} />
        )}
        <AccountLastTransactionsCard key={accountId} account={account} />
      </Box>
    );
  }
}

export default connectData(withMe(AccountView), {
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
