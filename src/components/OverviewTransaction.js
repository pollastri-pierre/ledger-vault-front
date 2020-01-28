// @flow
import React from "react";
import moment from "moment";
import { BigNumber } from "bignumber.js";

import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import type { Account, TransactionType } from "data/types";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import Box from "components/base/Box";
import Text from "components/base/Text";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "./CurrencyAccountValue";

type Props = {
  amount: BigNumber,
  account: Account,
  transactionType: TransactionType,
  created_on?: string,
};

export default function OverviewTransaction(props: Props) {
  const { amount, account, transactionType, created_on } = props;
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
      {created_on && (
        <Box mt={10}>
          <Text textAlign="center" color={colors.steel} size="small">
            <DateFormat
              format={
                moment(new Date()).isSame(created_on, "year")
                  ? "ddd D MMM, h:mmA"
                  : "ddd D MMM YYYY, h:mmA"
              }
              date={created_on}
            />
          </Text>
        </Box>
      )}
    </Box>
  );
}
