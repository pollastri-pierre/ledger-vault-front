//@flow
import React, { PureComponent } from "react";
import connectData from "../decorators/connectData";
import api from "../data/api-spec";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { inferUnitValue } from "../data/currency";
import type { Currency } from "../datatypes";

type Props = {
  // it can be a crypto currency name or also can be a countervalue like EUR
  currencyName: string,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // if true, display the countervalue instead of the actual crypto currency
  countervalue: boolean,
  // data store
  currencies: Array<Currency>
};

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyNameValue extends PureComponent<Props> {
  static defaultProps = {
    countervalue: false
  };
  render() {
    const {
      currencyName,
      countervalue,
      value,
      currencies,
      ...rest
    } = this.props;
    const UnitValue = inferUnitValue(
      currencies,
      currencyName,
      value,
      countervalue
    );
    return <CurrencyUnitValue {...rest} {...UnitValue} />;
  }
}

export default connectData(CurrencyNameValue, {
  api: {
    currencies: api.currencies
  }
});
