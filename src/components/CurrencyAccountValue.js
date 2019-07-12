// @flow
import React, { Component } from "react";
import type { BigNumber } from "bignumber.js";
import { getAccountCurrencyUnit } from "data/currency";
import type { Account, TransactionType, ERC20Token } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import CurrencyUnitValue from "./CurrencyUnitValue";

// This is a "smart" component that accepts a contextual account and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue
export const getCurrencyLikeUnit = (token: ?ERC20Token) => ({
  code: token ? token.ticker : "",
  symbol: "",
  magnitude: token ? token.decimals : 0,
  name: "",
});
class CurrencyAccountValue extends Component<{
  // the contextual account object
  account: Account,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: BigNumber,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // override the rate to use (default is the account.currentRate)
  type?: TransactionType,
  disableERC20?: boolean,
}> {
  render() {
    const { account, value, type, disableERC20, ...rest } = this.props;
    let unitValue;
    const isERC20 = account.account_type === "ERC20";
    if (isERC20 && !disableERC20) {
      const token = getERC20TokenByContractAddress(account.contract_address);
      unitValue = { value, unit: getCurrencyLikeUnit(token) };
    } else {
      unitValue = { value, unit: getAccountCurrencyUnit(account) };
    }
    return <CurrencyUnitValue {...rest} {...unitValue} type={type} />;
  }
}

export default CurrencyAccountValue;
