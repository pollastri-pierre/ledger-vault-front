// @flow
import React, { Component } from "react";
import type { Account } from "data/types";
import AccountIcon from "../AccountIcon";

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
    const { name, account, isERC20, currencyId } = this.props;
    const displayName = name || (account ? account.name : "[no name]");

    return (
      <div>
        <AccountIcon
          isERC20={(account && account.account_type === "ERC20") || isERC20}
          currencyId={(account && account.currency_id) || currencyId}
        />
        <span data-test="name">{displayName}</span>
      </div>
    );
  }
}

export default AccountName;
