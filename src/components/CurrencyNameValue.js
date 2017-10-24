//@flow
import React, { PureComponent } from 'react';
import CurrencyUnitValue from './CurrencyUnitValue';
import counterValueUnits from '../countervalue-units';
import currencies from '../currencies';

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

// TODO:
// we need to fetch all the available currencies. I suggest this is statically loaded, maybe injected from a server currencies.js script
// we also need to have a lib for world currencies.
// this will depend on user pref (if you select mBTC vs BTC , etc..)
// we might have a redux store that store user prefered unit per currencyName
// we also need to lookup the world currencies (eur, usd, ...)
class CurrencyNameValue extends PureComponent {
  props: {
    currencyName: number,
    value: number,
    alwaysShowSign?: boolean
  };
  render() {
    const { currencyName, ...rest } = this.props;
    let unit;
    // try to find a countervalues unit
    if (currencyName in counterValueUnits) {
      unit = counterValueUnits[currencyName];
    } else {
      // try to find a crypto currencies unit
      unit = currencies.find(c => c.name === currencyName);
    }

    if (!unit) {
      throw new Error(`currency "${currencyName}" not found`);
    }

    return <CurrencyUnitValue {...rest} unit={unit} />;
  }
}

export default CurrencyNameValue;
