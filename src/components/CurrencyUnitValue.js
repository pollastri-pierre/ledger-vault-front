// @flow
import React, { PureComponent } from "react";
import type { Unit, TransactionType } from "data/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/helpers/currencies";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
class CurrencyUnitValue extends PureComponent<{
  unit: Unit,
  value: number, // e.g. 10000 . for EUR it means €100.00
  type?: TransactionType,
  alwaysShowSign?: boolean // do you want to show the + before the number (N.B. minus is always displayed)
}> {
  render() {
    const { unit, value, alwaysShowSign, type } = this.props;
    const className = [
      "currency-unit-value",
      "sign-" + (type === "SEND" ? "negative" : "positive")
    ].join(" ");
    return (
      <span
        title={formatCurrencyUnit(unit, value, {
          showCode: true,
          alwaysShowSign: alwaysShowSign
        })}
        className={className}
      >
        {formatCurrencyUnit(unit, value, {
          showCode: true,
          alwaysShowSign: alwaysShowSign,
          showAllDigits: true
        })}
      </span>
    );
  }
}

export default CurrencyUnitValue;
