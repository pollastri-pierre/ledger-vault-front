//@flow
import React, { PureComponent } from "react";
import connectData from "../decorators/connectData";
import api from "../data/api-spec";
import CurrencyUnitValue from "./CurrencyUnitValue";
import {
  inferUnit,
  countervalueForRate,
  getCurrencyRate
} from "../data/currency";
import type { Rate } from "../datatypes";

class CurrencyCounterValueConversion extends PureComponent<*> {
  props: {
    currencyName: string,
    currencies: *,
    rate: ?Rate // override the rate to use (default is the currency current rate)
  };
  render() {
    let { currencyName, currencies, rate } = this.props;
    const unit = inferUnit(currencies, currencyName);
    if (!rate) {
      rate = getCurrencyRate(currencies, currencyName);
    }
    const one = Math.pow(10, unit.magnitude); // 1 in satoshis
    const value =
      // we find a value that don't make the counter value being less than 2 digits
      // (e.g. it will never be 1 DOGE = 0.00 EUR but it will be 1'000 DOGE = 1.00 EUR)
      one *
      Math.pow(10, Math.max(0, 2 - Math.floor(Math.log10(rate.value * one))));

    let toUnitValue = countervalueForRate(rate, value);
    return (
      <span>
        <CurrencyUnitValue unit={unit} value={value} />
        {" ≈ "}
        <CurrencyUnitValue {...toUnitValue} />
      </span>
    );
  }
}

export default connectData(CurrencyCounterValueConversion, {
  api: {
    currencies: api.currencies
  }
});
