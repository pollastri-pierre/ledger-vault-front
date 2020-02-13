// @flow

import React from "react";
import type { Match } from "react-router-dom";

import { useMe } from "components/UserContextProvider";
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
  TransactionsGraphWidget,
  connectWidget,
  UtxoGraphWidget,
} from "components/widgets";

type Props = {
  account: Account,
};

function AccountView(props: Props) {
  const { account } = props;
  const me = useMe();
  return (
    <Box flow={20} key={account.id}>
      <AccountWarning account={account} me={me} />
      <ResponsiveContainer>
        <Box flow={20} grow>
          <AccountQuickInfoWidget account={account} />
          <ResponsiveContainer>
            {account.account_type === "Ethereum" ? (
              <Box flex={1}>
                <SubAccountsWidget account={account} />
              </Box>
            ) : account.account_type === "Bitcoin" ? (
              <Box flex={2}>
                <UtxoGraphWidget account={account} />
              </Box>
            ) : null}
            {isBalanceAvailable(account) && (
              <Box flex={2} style={{ minWidth: 500 }}>
                <TransactionsGraphWidget account={account} />
              </Box>
            )}
          </ResponsiveContainer>
          <AccountLastTransactionsWidget account={account} />
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
