// @flow

import React from "react";
import type { Match } from "react-router-dom";

import AccountWarning from "containers/Account/AccountWarning";
import ResponsiveContainer from "components/base/ResponsiveContainer";
import type { Account } from "data/types";
import AccountQuery from "api/queries/AccountQuery";
import { isBalanceAvailable } from "utils/accounts";
import Box from "components/base/Box";
import {
  AccountQuickInfoWidget,
  AccountLastTransactionsWidget,
  SubAccountsWidget,
  AccountTransactionRulesWidget,
  TransactionsGraphWidget,
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
        <Box flow={20} grow>
          <AccountQuickInfoWidget account={account} />
          {account.account_type === "Ethereum" && (
            <SubAccountsWidget account={account} />
          )}
          <AccountLastTransactionsWidget account={account} />
        </Box>
        <Box flow={20} width={600}>
          <AccountWarning account={account} />
          {account.tx_approval_steps && (
            <AccountTransactionRulesWidget account={account} />
          )}
          {isBalanceAvailable(account) && (
            <TransactionsGraphWidget account={account} />
          )}
        </Box>
      </ResponsiveContainer>
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
