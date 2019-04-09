// @flow

import React, { PureComponent } from "react";

import Text from "components/base/Text";
import Box from "components/base/Box";

import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";

class TaskAmount extends PureComponent<{
  task: *,
  account: Account,
}> {
  render() {
    const { task, account } = this.props;
    return (
      <Box width={150} align="flex-end">
        <Text bold>
          <CurrencyAccountValue
            alwaysShowSign
            account={account}
            value={task.transaction.price.amount}
            erc20Format={account.account_type === "ERC20"}
          />
        </Text>
      </Box>
    );
  }
}

export default TaskAmount;
