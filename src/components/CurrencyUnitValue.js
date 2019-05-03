// @flow
import { PureComponent } from "react";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import type { BigNumber } from "bignumber.js";

import type { TransactionType } from "data/types";

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
type Props = {
  unit: Unit,
  value: BigNumber, // e.g. 10000 . for EUR it means €100.00
  type?: TransactionType,
  alwaysShowSign?: boolean, // do you want to show the + before the number (N.B. minus is always displayed)
};

export function currencyUnitValueFormat(
  unit: Unit,
  value: BigNumber,
  { alwaysShowSign }: { alwaysShowSign?: boolean } = {},
) {
  return formatCurrencyUnit(unit, value, {
    showCode: true,
    alwaysShowSign,
    showAllDigits: false,
  });
}

class CurrencyUnitValue extends PureComponent<Props> {
  render() {
    const { unit, value, alwaysShowSign, type } = this.props;
    let value_with_sign = value;
    if (type === "SEND") value_with_sign = value.multipliedBy(-1);
    return currencyUnitValueFormat(unit, value_with_sign, { alwaysShowSign });
  }
}

export default CurrencyUnitValue;
