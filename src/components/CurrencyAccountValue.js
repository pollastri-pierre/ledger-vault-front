//@flow
import React, { Component } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { countervalueForRate, getAccountCurrencyUnit } from "data/currency";
import type { Account, Rate } from "data/types";

// This is a "smart" component that accepts a contextual account and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

type TransactionType = "RECEIVE" | "SEND";

class CurrencyAccountValue extends Component<{
  // the contextual account object
  account: Account,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // if true, display the countervalue instead of the actual crypto currency
  countervalue?: boolean,
  // override the rate to use (default is the account.currentRate)
  rate?: Rate,
  type?: TransactionType
}> {
  render() {
    const { account, countervalue, value, rate, type, ...rest } = this.props;
    let unitValue = countervalue
      ? countervalueForRate(rate || account.currencyRate, value)
      : { value, unit: getAccountCurrencyUnit(account) };
    return <CurrencyUnitValue {...rest} {...unitValue} type={type} />;
  }
}

export default CurrencyAccountValue;
