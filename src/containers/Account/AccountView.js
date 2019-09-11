// @flow

import React from "react";
import styled from "styled-components";
import type { Match } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import AccountWarning from "containers/Account/AccountWarning";
import ResponsiveContainer from "components/base/ResponsiveContainer";
import VaultLink from "components/VaultLink";
import type { Account } from "data/types";
import AccountQuery from "api/queries/AccountQuery";
import { isBalanceAvailable } from "utils/accounts";
import Box from "components/base/Box";
import Text from "components/base/Text";
import {
  AccountQuickInfoWidget,
  AccountLastTransactionsWidget,
  SubAccountsWidget,
  AccountTransactionRulesWidget,
  TransactionsGraphWidget,
  connectWidget,
} from "components/widgets";

import colors from "shared/colors";

type Props = {
  account: Account,
};

function AccountView(props: Props) {
  const { account } = props;
  return (
    <Box flow={20} key={account.id}>
      <VaultLink withRole to="/accounts">
        <AccountBackNav>
          <FaArrowLeft />
          <Text i18nKey="accountView:backButton" />
        </AccountBackNav>
      </VaultLink>
      <AccountWarning account={account} />
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

const AccountBackNav = styled(Box).attrs({
  horizontal: true,
  align: "center",
  flow: 10,
  color: colors.legacyLightGrey3,
})`
  &:hover {
    color: ${colors.legacyDarkGrey1};
  }
`;
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: -10px;
`;
