// @flow

import React, { PureComponent } from "react";
import AccountName from "components/AccountName";
import Box from "components/base/Box";

import type { Account } from "data/types";

class TxAccountName extends PureComponent<{
  account: Account,
}> {
  render() {
    const { account } = this.props;

    return (
      <Box width={150}>
        <AccountName account={account} />
      </Box>
    );
  }
}

export default TxAccountName;
