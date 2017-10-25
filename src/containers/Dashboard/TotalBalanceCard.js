//@flow
import React, { Component } from 'react';
import CurrencyNameValue from '../../components/CurrencyNameValue';
import DeltaChange from '../../components/DeltaChange';
import TotalBalanceFilter from '../../components/TotalBalanceFilter';
import DateFormat from '../../components/DateFormat';
import Card from '../../components/Card';
import DashboardField from './DashboardField';
import { TotalBalanceFilters } from '../../redux/modules/dashboard';
import './TotalBalanceCard.css';

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
        className="total-balance"
        title="total balance"
        titleRight={
          <TotalBalanceFilter
            value={totalBalanceFilter}
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
          <DashboardField
            label={`since ${TotalBalanceFilters[totalBalanceFilter].title}`}
          >
            <DeltaChange
              before={totalBalance.valueHistory[totalBalanceFilter]}
              after={totalBalance.value}
            />
          </DashboardField>
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
