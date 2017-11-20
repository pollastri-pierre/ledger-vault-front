//@flow
import React, { Component } from "react";
import connectData from "../restlay/connectData";
import CurrenciesQuery from "../api/queries/CurrenciesQuery";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { inferUnit, countervalueForRate } from "../data/currency";
import type { Currency, Rate } from "../data/types";

type Props = {
  // it can be a crypto currency name or also can be a countervalue like EUR
  currencyName: string,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // if true, display the countervalue instead of the actual crypto currency
  countervalue?: boolean,
  // override the rate to use (default is the currency current rate)
  rate?: Rate,

  // from connectData
  currencies: Array<Currency>
};

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyNameValue extends Component<Props> {
  componentDidMount() {
    console.warn(
      "Usage of CurrencyNameValue is deprecated. Use one of these: CurrencyUnitValue, CurrencyFiatValue or CurrencyAccountValue"
    );
  }
  render() {
    const {
      currencyName,
      countervalue,
      value,
      currencies,
      rate,
      ...rest
    } = this.props;
    if (countervalue && !rate) {
      throw new Error(
        "CurrencyNameValue: Can't calculate countervalue without an explicit rate. Consider using CurrencyAccountValue component instead"
      );
    }
    let unitValue =
      countervalue && rate
        ? countervalueForRate(rate, value)
        : { value, unit: inferUnit(currencies, currencyName) };
    return <CurrencyUnitValue {...rest} {...unitValue} />;
  }
}

export default connectData(CurrencyNameValue, {
  queries: {
    currencies: CurrenciesQuery
  }
});
