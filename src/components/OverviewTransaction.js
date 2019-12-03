// @flow
import React from "react";
import { BigNumber } from "bignumber.js";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import type { Account, TransactionType } from "data/types";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CurrencyAccountValue from "./CurrencyAccountValue";

type Props = {
  amount: BigNumber,
  account: Account,
  transactionType: TransactionType,
};

export default function OverviewTransaction(props: Props) {
  const { amount, account, transactionType } = props;
  const isReceive = transactionType === "RECEIVE";
  return (
    <Box mb={32}>
      <Box horizontal justify="center" align="center" flow={10}>
        <TransactionTypeIcon type={transactionType} />
        <Text size="header" color={isReceive ? colors.green : colors.shark}>
          <CurrencyAccountValue
            account={account}
            value={amount}
            alwaysShowSign
            type={transactionType}
          />
        </Text>
      </Box>
      <Text
        textAlign="center"
        color={colors.steel}
        size="small"
        fontWeight="semiBold"
      >
        <CounterValue
          value={amount}
          fromAccount={account}
          alwaysShowSign
          type={transactionType}
        />
      </Text>
    </Box>
  );
}
