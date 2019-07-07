// @flow

import React from "react";
import type { Match } from "react-router-dom";

import AccountWarning from "containers/Account/AccountWarning";
import ResponsiveContainer from "components/base/ResponsiveContainer";
import type { Account } from "data/types";
import AccountQuery from "api/queries/AccountQuery";
import Box from "components/base/Box";
import {
  AccountQuickInfoWidget,
  AccountLastTransactionsWidget,
  SubAccountsWidget,
  connectWidget,
} from "components/widgets";

type Props = {
  account: Account,
};

function AccountView(props: Props) {
  const { account } = props;
  return (
    <Box flow={20} key={account.id}>
      <ResponsiveContainer>
        <Box grow>
          <AccountQuickInfoWidget account={account} />
        </Box>
        <AccountWarning account={account} />
      </ResponsiveContainer>
      {account.account_type === "Ethereum" && (
        <SubAccountsWidget account={account} />
      )}
      <AccountLastTransactionsWidget account={account} />
    </Box>
  );
}

export default connectWidget(AccountView, {
  height: 600,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: ({ match }: { match: Match }) => ({
    accountId: match.params.id,
  }),
});
