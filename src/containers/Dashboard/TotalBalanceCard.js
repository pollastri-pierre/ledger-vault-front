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
import CustomSelectField from "../../components/CustomSelectField/CustomSelectField.js";
import _ from "lodash";

class TotalBalance extends Component<{
    totalBalance: *,
    filter: string,
    onTotalBalanceFilterChange: (value: string) => void
  }>
  {

  reShapeData = (data) => {return {key: data, title: TotalBalanceFilters[data].title}}
  render() {
    console.log(this.props)
    const { dashboard, onTotalBalanceFilterChange, filter, totalBalance } = this.props;
    const values = _.reduce(Object.keys(TotalBalanceFilters), (values, filter) => {values.push({key: filter, title: TotalBalanceFilters[filter].title}); return values;}, []);
    return (
      <Card
        className="total-balance"
        title="total balance"
        titleRight={
          <CustomSelectField values={values} selected={this.reShapeData(filter)} onChange={onTotalBalanceFilterChange} />
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
