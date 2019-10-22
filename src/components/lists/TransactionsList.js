// @flow

import React from "react";

import TransactionTypeIcon from "components/TransactionTypeIcon";
import Text from "components/base/Text";
import DateFormat from "components/DateFormat";
import Box from "components/base/Box";
import AccountName from "components/AccountName";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import TransactionStatus from "components/TransactionStatus";
import type { Transaction, Account } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Props = {
  emptyState: React$Node,
  transactions: Transaction[],
  accounts: Account[],
  showStatus?: boolean,
  onTransactionClick: Transaction => void,
  dataTest?: string,
};

export default function TransactionsList(props: Props) {
  const {
    transactions,
    accounts,
    emptyState,
    showStatus,
    onTransactionClick,
    dataTest,
  } = props;

  if (!transactions.length) {
    return <ListEmpty>{emptyState}</ListEmpty>;
  }

  return (
    <List data-test={dataTest}>
      {transactions.map((transaction, i) => {
        const account = accounts.find(a => a.id === transaction.account_id);
        if (!account) return null;
        return (
          <TransactionCard
            key={transaction.id}
            showStatus={showStatus}
            dataTest={i}
            transaction={transaction}
            account={account}
            onClick={onTransactionClick}
          />
        );
      })}
    </List>
  );
}

type TransactionCardProps = {
  transaction: Transaction,
  account: Account,
  showStatus?: boolean,
  onClick: Transaction => void,
  dataTest: number,
};

function TransactionCard(props: TransactionCardProps) {
  const { transaction, account, onClick, showStatus, dataTest } = props;
  const amount =
    transaction.amount || (transaction.price && transaction.price.amount);

  const handleClick = () => onClick(transaction);
  return (
    <ListItem
      onClick={handleClick}
      data-test={dataTest}
      style={{ padding: 17 }}
    >
      <Box horizontal justify="space-between">
        <Box horizontal justify="space-between" width={300}>
          <Box flow={5}>
            <Box horizontal flow={10}>
              <TransactionTypeIcon type={transaction.type} />
              <Text fontWeight="bold">
                {transaction.type === "RECEIVE" ? "Received" : "Sent"}
              </Text>
            </Box>
            <Text size="small" italic color={colors.mediumGrey}>
              <DateFormat
                format="ddd D MMM, h:mmA"
                date={transaction.created_on}
              />
            </Text>
          </Box>
          {showStatus ? (
            <TransactionStatus transaction={transaction} />
          ) : (
            <AccountName account={account} />
          )}
        </Box>
        <Box flow={10} width={100} align="center" justify="center">
          <Text size="small" color={colors.mediumGrey}>
            {transaction.recipient}
          </Text>
        </Box>
        <Box
          justify="center"
          flow={5}
          style={{ minWidth: 200, textAlign: "right" }}
        >
          <Text
            fontWeight={transaction.type === "RECEIVE" ? "bold" : null}
            color={transaction.type === "RECEIVE" ? colors.green : "inherit"}
          >
            <CurrencyAccountValue
              account={account}
              value={amount}
              type={transaction.type}
              alwaysShowSign
            />
          </Text>
          <Text size="small">
            <CounterValue
              fromAccount={account}
              value={amount}
              alwaysShowSign
              disableTooltip
              type={transaction.type}
            />
          </Text>
        </Box>
      </Box>
    </ListItem>
  );
}
