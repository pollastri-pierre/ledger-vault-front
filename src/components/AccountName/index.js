// @flow
import React, { Component } from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountIcon from "components/AccountIcon";

import type { Account } from "data/types";

class AccountName extends Component<{
  account?: Account,
  name?: string | React$Node,
  // for account creation confirmation we don't have the account type yet,
  // so we can't rely account_type. It's useful to tell the component we are dealing with an erc20 token or
  // with a specific currency so it can pass it to AccountIcon
  currencyId?: string,
  isERC20?: boolean
}> {
  render() {
    const { name, account, ...props } = this.props;
    let { isERC20, currencyId } = this.props;

    const displayName = name || (account ? account.name : "[no name]");

    isERC20 = (account && account.account_type === "ERC20") || isERC20;
    currencyId = (account && account.currency_id) || currencyId;

    return (
      <Box horizontal align="center" flow={10} {...props}>
        <AccountIcon isERC20={isERC20} currencyId={currencyId} />
        <Text lineHeight={1} noWrap data-test="name">
          {displayName}
        </Text>
      </Box>
    );
  }
}

export default AccountName;
