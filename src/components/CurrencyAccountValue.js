//@flow
import React, { Component } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { getAccountCurrencyUnit } from "data/currency";
import type { Account, TransactionType } from "data/types";

// This is a "smart" component that accepts a contextual account and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyAccountValue extends Component<{
  // the contextual account object
  account: Account,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // override the rate to use (default is the account.currentRate)
  type?: TransactionType
}> {
  render() {
    const { account, value, type, ...rest } = this.props;
    let unitValue = { value, unit: getAccountCurrencyUnit(account) };
    return <CurrencyUnitValue {...rest} {...unitValue} type={type} />;
  }
}

export default CurrencyAccountValue;
