// @flow

import React, { PureComponent } from "react";

import Text from "components/base/Text";
import Box from "components/base/Box";

import CounterValue from "components/CounterValue";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Transaction, Account } from "data/types";

import colors from "shared/colors";

class TxAmount extends PureComponent<{
  transaction: Transaction,
  account: Account,
}> {
  render() {
    const { transaction, account } = this.props;
    return (
      <Box width={150} align="flex-end">
        <Text
          color={transaction.type === "RECEIVE" ? colors.green : colors.lead}
          bold
        >
          <CurrencyAccountValue
            alwaysShowSign
            account={account}
            value={transaction.amount}
            type={transaction.type}
            erc20Format={account.account_type === "ERC20"}
          />
        </Text>
        <CounterValue
          from={account.currency}
          value={transaction.amount}
          alwaysShowSign
          disableCountervalue={account.account_type === "ERC20"}
          type={transaction.type}
        />
      </Box>
    );
  }
}

export default TxAmount;
