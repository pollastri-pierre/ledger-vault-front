// @flow
import React, { PureComponent } from "react";
import type { Unit } from "../data/types";
import { formatCurrencyUnit } from "../data/currency";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
class CurrencyUnitValue extends PureComponent<{
  unit: Unit,
  value: number, // e.g. 10000 . for EUR it means €100.00
  alwaysShowSign?: boolean // do you want to show the + before the number (N.B. minus is always displayed)
}> {
  render() {
    const { unit, value, alwaysShowSign } = this.props;
    const className = [
      "currency-unit-value",
      "sign-" + (value < 0 ? "negative" : value > 0 ? "positive" : "zero")
    ].join(" ");
    return (
      <span
        title={formatCurrencyUnit(unit, value, true, alwaysShowSign, true)}
        className={className}
      >
        {formatCurrencyUnit(
          unit,
          value,
          true,
          alwaysShowSign,
          unit.showAllDigits
        )}
      </span>
    );
  }
}

export default CurrencyUnitValue;
