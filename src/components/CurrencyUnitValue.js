//@flow
import React, { PureComponent } from 'react';
import numeral from 'numeral';
import type { Unit } from '../datatypes';

// This is a "dumb" component that accepts a unit object and a value number
// this component is generic and not responsible of styles.
// N.B. we might consider use more <span> if we want to apply various style.

// TODO: we will have a CurrencyNameValue
// unit prop is annoying to provide as we don't always have it.
// also this will depend based on user pref (if you select mBTC vs BTC , etc..)
// so I suggest we have a redux store that context all user prefered unit per currencyName,
// and create a smarter component on top of this that would provide unit implicitely
// and would just accept that currencyName as prop.
class CurrencyUnitValue extends PureComponent<*> {
  props: {
    unit: Unit,
    value: number, // e.g. 10000 . for EUR it means €100.00
    alwaysShowSign?: boolean, // do you want to show the + before the number (N.B. minus is always displayed)
    showAllDigits?: boolean
  };
  render() {
    const { unit, value, alwaysShowSign, showAllDigits } = this.props;
    let absValue = Math.abs(value);
    let divider = 1;
    let format = '0,0';
    if (unit.magnitude > 0) {
      format += '.';
      if (!showAllDigits) {
        format += '[';
      }
      for (let i = 0; i < unit.magnitude; i++) {
        format += '0';
        divider *= 10;
      }
      if (!showAllDigits) {
        format += ']';
      }
    }
    return (
      <span
        className={[
          'currency-unit-value',
          'sign-' + (value < 0 ? 'negative' : value > 0 ? 'positive' : 'zero')
        ].join(' ')}
      >
        {(value < 0 ? '- ' : alwaysShowSign ? '+ ' : '') +
          unit.code +
          ' ' +
          numeral(absValue / divider).format(format)}
      </span>
    );
  }
}

export default CurrencyUnitValue;
