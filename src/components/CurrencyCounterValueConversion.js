//@flow
import React, { PureComponent } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { getAccountCurrencyUnit, countervalueForRate } from "data/currency";
import type { Rate, Account } from "data/types";

class CurrencyCounterValueConversion extends PureComponent<*> {
  props: {
    account: Account,
    rate?: Rate // override the rate to use (default is the currency current rate)
  };
  render() {
    let { account, rate } = this.props;
    const unit = getAccountCurrencyUnit(account);
    if (!rate) {
      rate = account.currencyRate;
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

export default CurrencyCounterValueConversion;
