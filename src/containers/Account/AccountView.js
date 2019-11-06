// @flow

import React from "react";
import styled from "styled-components";
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
  AccountTransactionRulesWidget,
  TransactionsGraphWidget,
  connectWidget,
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
          {account.account_type === "Ethereum" && (
            <SubAccountsWidget account={account} />
          )}
          <div>
            <Container>
              {account.tx_approval_steps && (
                <Box flex={1} style={{ margin: 10 }}>
                  <AccountTransactionRulesWidget account={account} />
                </Box>
              )}
              {isBalanceAvailable(account) && (
                <Box flex={1} style={{ minWidth: 500, margin: 10 }}>
                  <TransactionsGraphWidget account={account} />
                </Box>
              )}
            </Container>
          </div>
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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: -10px;
`;
