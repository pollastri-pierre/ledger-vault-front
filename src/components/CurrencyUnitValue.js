// @flow
import React, { PureComponent } from "react";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/helpers/currencies";

import type { Unit, TransactionType } from "data/types";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
type Props = {
  unit: Unit,
  value: number, // e.g. 10000 . for EUR it means €100.00
  type?: TransactionType,
  alwaysShowSign?: boolean // do you want to show the + before the number (N.B. minus is always displayed)
};

class CurrencyUnitValue extends PureComponent<Props> {
  render() {
    const { unit, value, alwaysShowSign, type } = this.props;
    const className = [
      "currency-unit-value",
      `sign-${type === "SEND" ? "negative" : "positive"}`
    ].join(" ");
    let value_with_sign = value;
    if (type === "SEND") value_with_sign = value * -1;
    return (
      <span
        title={formatCurrencyUnit(unit, value_with_sign, {
          showCode: true,
          alwaysShowSign
        })}
        className={className}
      >
        {formatCurrencyUnit(unit, value_with_sign, {
          showCode: true,
          alwaysShowSign,
          showAllDigits: false
        })}
      </span>
    );
  }
}

export default CurrencyUnitValue;
