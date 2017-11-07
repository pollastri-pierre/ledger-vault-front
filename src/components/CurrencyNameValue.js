//@flow
import React, { PureComponent } from "react";
import connectData from "../decorators/connectData";
import api from "../data/api-spec";
import CurrencyUnitValue from "./CurrencyUnitValue";
import {
  inferUnit,
  getCurrencyRate,
  countervalueForRate
} from "../data/currency";
import type { Currency, Rate } from "../datatypes";

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
  // data store
  currencies: Array<Currency>
};

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyNameValue extends PureComponent<Props> {
  render() {
    const {
      currencyName,
      countervalue,
      value,
      currencies,
      rate,
      ...rest
    } = this.props;
    let unitValue = countervalue
      ? countervalueForRate(
          rate || getCurrencyRate(currencies, currencyName),
          value
        )
      : {
          unit: inferUnit(currencies, currencyName),
          value
        };
    return <CurrencyUnitValue {...rest} {...unitValue} />;
  }
}

export default connectData(CurrencyNameValue, {
  api: {
    currencies: api.currencies
  }
});
