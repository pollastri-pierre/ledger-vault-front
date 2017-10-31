//@flow
import React, { PureComponent } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import counterValueUnits from "../countervalue-units";
import currencies from "../currencies";
import type { Unit } from "../datatypes";

export function findUnit(
  currencyName: string
): { unit: Unit, showAllDigits: boolean } {
  let unit;
  let showAllDigits = false;
  // try to find a countervalues unit
  if (currencyName in counterValueUnits) {
    unit = counterValueUnits[currencyName];
    showAllDigits = true;
  } else {
    // try to find a crypto currencies unit
    const currency = currencies.find(c => c.name === currencyName);
    if (currency) {
      // TODO:
      // this will depend on user pref (if you select mBTC vs BTC , etc..)
      // we might have a redux store that store user prefered unit per currencyName
      unit = currency.units[0];
    }
  }
  if (!unit) {
    throw new Error(`currency "${currencyName}" not found`);
  }
  return { unit, showAllDigits };
}

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyNameValue extends PureComponent<*> {
  props: {
    currencyName: string,
    value: number,
    alwaysShowSign?: boolean
  };
  render() {
    const { currencyName, ...rest } = this.props;
    const { unit, showAllDigits } = findUnit(currencyName);
    return (
      <CurrencyUnitValue showAllDigits={showAllDigits} unit={unit} {...rest} />
    );
  }
}

export default CurrencyNameValue;
