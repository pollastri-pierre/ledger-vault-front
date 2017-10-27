//@flow
import React, { Component } from 'react';
import CurrencyNameValue from '../../components/CurrencyNameValue';
import DeltaChange from '../../components/DeltaChange';
import TotalBalanceFilter, {
  TotalBalanceFilters
} from '../../components/TotalBalanceFilter';
import DateFormat from '../../components/DateFormat';
import Card from '../../components/Card';
import DashboardField from './DashboardField';
import EvolutionSince from './EvolutionSince';
import './TotalBalanceCard.css';

class TotalBalance extends Component<{
  accounts: *,
  filter: string,
  onTotalBalanceFilterChange: (value: string) => void
}> {
  render() {
    const { accounts, filter, onTotalBalanceFilterChange } = this.props;
    const totalBalance = {
      // TODO COMPUTE!
      currencyName: 'EUR',
      date: new Date().toISOString(),
      value: 1589049,
      valueHistory: {
        yesterday: 1543125,
        week: 1031250,
        month: 2043125
      },
      accountsCount: 5,
      currenciesCount: 4,
      membersCount: 8
    };

    return (
      <Card
        className="total-balance"
        title="total balance"
        titleRight={
          <TotalBalanceFilter
            value={filter}
            onChange={onTotalBalanceFilterChange}
          />
        }
      >
        <div className="body">
          <DashboardField label={<DateFormat date={totalBalance.date} />}>
            <CurrencyNameValue
              currencyName={totalBalance.currencyName}
              value={totalBalance.value}
            />
          </DashboardField>
          <EvolutionSince
            value={totalBalance.value}
            valueHistory={totalBalance.valueHistory}
            filter={filter}
          />
          <DashboardField label="accounts" align="right">
            {totalBalance.accountsCount}
          </DashboardField>
          <DashboardField label="currencies" align="right">
            {totalBalance.currenciesCount}
          </DashboardField>
          <DashboardField label="members" align="right">
            {totalBalance.membersCount}
          </DashboardField>
        </div>
      </Card>
    );
  }
}

export default TotalBalance;
