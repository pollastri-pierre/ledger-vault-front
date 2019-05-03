// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import Box from "components/base/Box";
import Text from "components/base/Text";

import { genUsers, genAccounts, genTransactions } from "data/mock-entities";

import TxRow from "./TxRow";

const TxRowContainer = styled(Box).attrs({
  horizontal: true,
  px: 5,
})`
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #eee;
    cursor: pointer;
  }
`;
// NOTE: temp mock data
const users = genUsers(20);
const accounts = genAccounts(10, { users });
const transactions = genTransactions(25, { accounts, users });

type Props = {
  history: MemoryHistory,
  match: Match,
};
class Transactions extends PureComponent<Props> {
  handleTransactionClick = (transactionId: string) => {
    const { history, match } = this.props;
    history.push(`${match.url}/transactions/details/${transactionId}/overview`);
  };

  render() {
    return (
      <>
        <Box flow={5} p={10}>
          <Text bold i18nKey="operatorDashboard:transactions.header" />
          <Box>
            {transactions.map(transaction => (
              <TxRowContainer
                onClick={() => this.handleTransactionClick(transaction.id)}
              >
                <TxRow transaction={transaction} accounts={accounts} />
              </TxRowContainer>
            ))}
          </Box>
        </Box>
      </>
    );
  }
}

export default Transactions;
