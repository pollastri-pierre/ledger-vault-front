//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import PieChart from "./PieChart";
import { countervalueForRate } from "../../data/currency";
import type { Account } from "../../data/types";
import AccountsQuery from "../../api/queries/AccountsQuery";

type AggregatedData = {
  [_: string]: {
    account: Account,
    balance: number,
    counterValueBalance: number
  }
};

function Currencies({ accounts }: { accounts: Array<Account> }) {
  //compute currencies from accounts balance
  const data: AggregatedData = accounts.reduce(
    (acc: AggregatedData, account) => {
      const currency_name = account.currency.name;
      const balance = account.balance;
      //check if currency already added
      if (!acc[currency_name]) {
        acc[currency_name] = {
          account,
          balance: 0,
          counterValueBalance: 0
        };
      }
      acc[currency_name].balance += balance;
      acc[currency_name].counterValueBalance += countervalueForRate(
        account.currencyRateInReferenceFiat,
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
      <PieChart data={pieChartData} width="140" height="140" />
    </div>
  );
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
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
