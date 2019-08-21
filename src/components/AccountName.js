// @flow
import React, { Component } from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountIcon from "components/AccountIcon";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";

import type { Account } from "data/types";

class AccountName extends Component<{
  account?: $Shape<Account>,
  name?: string | React$Node,
  // for account creation confirmation we don't have the account type yet,
  // so we can't rely account_type. It's useful to tell the component we are dealing with an erc20 token or
  // with a specific currency so it can pass it to AccountIcon
  currencyId?: string,
  space?: number,
}> {
  render() {
    const { name, account, space, ...props } = this.props;
    let { currencyId } = this.props;

    const displayName = name || (account ? account.name : "[no name]");

    currencyId = (account && account.currency) || currencyId;

    const token =
      (account &&
        account.contract_address &&
        getERC20TokenByContractAddress(account.contract_address)) ||
      null;

    return (
      <Box horizontal align="center" flow={space || 10} {...props}>
        <AccountIcon token={token} currencyId={currencyId} />
        <Text lineHeight={1} noWrap data-test="name">
          {displayName}
        </Text>
      </Box>
    );
  }
}

export default AccountName;
