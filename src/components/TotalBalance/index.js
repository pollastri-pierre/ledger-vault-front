//@flow
import React, { Component } from 'react';
import CurrencyNameValue from '../CurrencyNameValue';
import DeltaChange from '../DeltaChange';

class TotalBalance extends Component<*> {
  props: {
    totalBalance: *,
    totalBalanceFilter: string
  };
  render() {
    const { totalBalance, totalBalanceFilter } = this.props;
    return (
      <div>
        <CurrencyNameValue
          currencyName={totalBalance.currencyName}
          value={totalBalance.value}
        />
        <DeltaChange
          before={totalBalance.valueHistory[totalBalanceFilter]}
          after={totalBalance.value}
        />
      </div>
    );
  }
}

export default TotalBalance;
