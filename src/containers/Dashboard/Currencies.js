//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import PieChart from "./PieChart";
import { countervalueForRate, getCurrencyRate } from "../../data/currency";
import type { Account, Currency } from "../../data/types";
import AccountsQuery from "../../api/queries/AccountsQuery";
import CurrenciesQuery from "../../api/queries/CurrenciesQuery";

type AggregatedData = {
  [_: string]: {
    meta: Currency,
    balance: number,
    counterValueBalance: number
  }
};

class Currencies extends Component<{
  accounts: Array<Account>,
  currencies: Array<Currency>
}> {
  render() {
    const { accounts, currencies } = this.props;
    //compute currencies from accounts balance
    const data: AggregatedData = accounts.reduce(
      (acc: AggregatedData, account) => {
        const currency_name = account.currency.name;
        const balance = account.balance;
        //check if currency already added
        if (!acc[currency_name]) {
          acc[currency_name] = {
            meta: account.currency,
            balance: 0,
            counterValueBalance: 0
          };
        }
        acc[currency_name].balance += balance;
        acc[currency_name].counterValueBalance += countervalueForRate(
          getCurrencyRate(currencies, currency_name),
          balance
        ).value;
        return acc;
      },
      {}
    );

    const pieChartData = Object.keys(data).reduce((currenciesList, c) => {
      currenciesList.push(data[c]);
      return currenciesList;
    }, []);

    return (
      <div className="dashboard-currencies">
        <PieChart data={pieChartData} />
      </div>
    );
  }
}

class RenderError extends Component<*> {
  render() {
    return <div className="dashboard-currencies" />;
  }
}

class RenderLoading extends Component<*> {
  render() {
    return <div className="dashboard-currencies" />;
  }
}

export default connectData(Currencies, {
  queries: {
    accounts: AccountsQuery,
    currencies: CurrenciesQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
