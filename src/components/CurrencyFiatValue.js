// @flow
import React, { Component } from "react";
import fiatUnits from "constants/fiatUnits";
import type { TransactionType } from "data/types";
import CurrencyUnitValue from "./CurrencyUnitValue";

type Props = {
  fiat: string,
  // it is the value to display without any digits (e.g. for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  type?: TransactionType
};

// accepts a fiat (e.g. EUR) and a value number

class CurrencyFiatValue extends Component<Props> {
  render() {
    const { fiat, value, ...rest } = this.props;
    if (!(fiat in fiatUnits)) throw new Error(`fiat '${fiat}' not found`);
    return <CurrencyUnitValue {...rest} value={value} unit={fiatUnits[fiat]} />;
  }
}

export default CurrencyFiatValue;
