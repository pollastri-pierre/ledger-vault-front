//@flow
import React, { PureComponent } from 'react';
import CurrencyUnitValue from './CurrencyUnitValue';

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
    const unit = {
      // FIXME TEMPORARY we need to actually infer it
      name: currencyName,
      code: currencyName.toUpperCase(),
      symbol: currencyName,
      magnitude: 'eur usd'.indexOf(currencyName.toLowerCase()) === -1 ? 8 : 2
    };
    return <CurrencyUnitValue {...rest} unit={unit} />;
  }
}

export default CurrencyNameValue;
