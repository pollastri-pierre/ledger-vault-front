//@flow

import React, { Component } from "react";

import type { Account } from "data/types";
import BadgeCurrency from "../BadgeCurrency";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

const DEFAULT_COLOR = { color: "black" };

class AccountName extends Component<{
  account?: Account,
  name?: string | React$Node,
  currencyId?: string
}> {
  render() {
    const { name, currencyId, account } = this.props;

    const displayName = name ? name : account ? account.name : "[no name]";
    const isERC20TokenAccount = account && account.account_type === "ERC20";

    const curId = currencyId
      ? currencyId
      : account
        ? account.currency_id
        : null;

    const cur = isERC20TokenAccount
      ? DEFAULT_COLOR
      : curId
        ? getCryptoCurrencyById(curId)
        : DEFAULT_COLOR;

    return (
      <span>
        <BadgeCurrency currency={cur} />
        <span data-test="name">{displayName}</span>
      </span>
    );
  }
}

export default AccountName;
