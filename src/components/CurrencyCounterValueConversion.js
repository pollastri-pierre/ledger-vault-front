//@flow
import React, { PureComponent } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { findUnit } from "./CurrencyNameValue";

class CurrencyCounterValueConversion extends PureComponent<*> {
  props: {
    fromCurrencyName: string,
    toCurrencyName: string,
    fromValue: number,
    toValue: number
  };
  render() {
    const { fromCurrencyName, toCurrencyName, fromValue, toValue } = this.props;
    if (fromValue <= 0) return null;
    const { unit: fromUnit } = findUnit(fromCurrencyName);
    const { unit: toUnit } = findUnit(toCurrencyName);
    const v1 = Math.pow(10, fromUnit.magnitude);
    const v2 = Math.round(v1 * toValue / fromValue);
    return (
      <span>
        <CurrencyUnitValue unit={fromUnit} value={v1} />
        {" ≈ "}
        <CurrencyUnitValue unit={toUnit} value={v2} />
      </span>
    );
  }
}

export default CurrencyCounterValueConversion;
