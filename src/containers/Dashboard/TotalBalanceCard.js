//@flow
import React, { Component } from 'react';
import CurrencyNameValue from '../../components/CurrencyNameValue';
import DeltaChange from '../../components/DeltaChange';
import TotalBalanceFilter from '../../components/TotalBalanceFilter';
import Card from '../../components/Card';

class TotalBalance extends Component<*> {
  props: {
    dashboard: *,
    onTotalBalanceFilterChange: (value: string) => void
  };
  render() {
    const { dashboard, onTotalBalanceFilterChange } = this.props;
    const { totalBalance, totalBalanceFilter } = dashboard;

    return (
      <Card
        title="total balance"
        titleRight={
          <TotalBalanceFilter
            value={totalBalanceFilter}
            onChange={onTotalBalanceFilterChange}
          />
        }
      >
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
      </Card>
    );
  }
}

export default TotalBalance;
