//@flow
import React, { PureComponent } from "react";
import type { Unit } from "../data/types";

const nonBreakableSpace = " ";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
class CurrencyUnitValue extends PureComponent<{
  unit: Unit,
  value: number, // e.g. 10000 . for EUR it means €100.00
  alwaysShowSign?: boolean // do you want to show the + before the number (N.B. minus is always displayed)
}> {
  render() {
    const { unit, value, alwaysShowSign } = this.props;
    const { magnitude, code } = unit;
    const floatValue = value / 10 ** magnitude;
    const minimumFractionDigits = unit.showAllDigits ? magnitude : 0;
    const maximumFractionDigits = Math.max(
      minimumFractionDigits,
      Math.max(
        0,
        // dynamic max number of digits based on the value itself. to only show significant part
        Math.min(4 - Math.round(Math.log10(Math.abs(floatValue))), magnitude)
      )
    );

    const className = [
      "currency-unit-value",
      "sign-" + (value < 0 ? "negative" : value > 0 ? "positive" : "zero")
    ].join(" ");

    const title =
      code +
      nonBreakableSpace +
      (alwaysShowSign && floatValue > 0 ? "+" : "") +
      floatValue.toLocaleString("en-EN", {
        maximumFractionDigits: magnitude,
        minimumFractionDigits
      });

    const format =
      code +
      nonBreakableSpace +
      (alwaysShowSign && floatValue > 0 ? "+" : "") +
      floatValue.toLocaleString("en-EN", {
        maximumFractionDigits,
        minimumFractionDigits
      });

    return (
      <span title={title} className={className}>
        {format}
      </span>
    );
  }
}

export default CurrencyUnitValue;
