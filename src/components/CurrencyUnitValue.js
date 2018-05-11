// @flow
import React, { PureComponent } from "react";
import type { Unit } from "data/types";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";
import { formatCurrencyUnit } from "data/currency";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
const styles = {
  negative: {
    opacity: 0.4
  }
};
class CurrencyUnitValue extends PureComponent<{
  unit: Unit,
  value: number, // e.g. 10000 . for EUR it means €100.00
  classes: { [_: $Keys<typeof styles>]: string },
  alwaysShowSign?: boolean // do you want to show the + before the number (N.B. minus is always displayed)
}> {
  render() {
    const { unit, value, alwaysShowSign, type, classes } = this.props;
    console.log(type);
    const className = [
      "currency-unit-value",
      "sign-" + (type === "SEND" ? "negative" : "positive")
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
          unit.showAllDigits,
          type
        )}
      </span>
    );
  }
}

export default withStyles(styles)(CurrencyUnitValue);
