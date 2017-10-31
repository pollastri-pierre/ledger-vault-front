//@flow
import React, { Component } from "react";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import { TotalBalanceFilters } from "../../components/TotalBalanceFilter";
import DateFormat from "../../components/DateFormat";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import EvolutionSince from "./EvolutionSince";
import "./TotalBalanceCard.css";
import CustomSelectField from "../../components/CustomSelectField/CustomSelectField.js";
import _ from "lodash";

class TotalBalance extends Component<{
  totalBalance: *,
  filter: string,
  onTotalBalanceFilterChange: (value: string) => void
}> {
  reShapeData = (filter: string) => {
    return { key: filter, title: TotalBalanceFilters[filter].title };
  };

  render() {
    const { onTotalBalanceFilterChange, filter, totalBalance } = this.props;
    const values = _.reduce(
      Object.keys(TotalBalanceFilters),
      (values, filter) => {
        values.push({ key: filter, title: TotalBalanceFilters[filter].title });
        return values;
      },
      []
    );
    return (
      <Card
        className="total-balance"
        title="total balance"
        titleRight={
          <CustomSelectField
            values={values}
            selected={this.reShapeData(filter)}
            onChange={onTotalBalanceFilterChange}
          />
        }
      >
        <div className="body">
          <CardField label={<DateFormat date={totalBalance.date} />}>
            <CurrencyNameValue
              currencyName={totalBalance.currencyName}
              value={totalBalance.value}
            />
          </CardField>
          <EvolutionSince
            value={totalBalance.value}
            valueHistory={totalBalance.valueHistory}
            filter={filter}
          />
          <CardField label="accounts" align="right">
            {totalBalance.accountsCount}
          </CardField>
          <CardField label="currencies" align="right">
            {totalBalance.currenciesCount}
          </CardField>
          <CardField label="members" align="right">
            {totalBalance.membersCount}
          </CardField>
        </div>
      </Card>
    );
  }
}

export default TotalBalance;
