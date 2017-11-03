//@flow
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import React, { Component } from "react";
import PieChart from "./PieChart";
import { inferUnitValue } from "../../data/currency";
import type { Account, Currency } from "../../datatypes";

function Currencies({
  accounts,
  currencies
}: {
  accounts: Array<Account>,
  currencies: Array<Currency>
}) {
  //compute currencies from accounts balance
  const data = accounts.reduce((acc, account) => {
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
    acc[currency_name].counterValueBalance += inferUnitValue(
      currencies,
      currency_name,
      balance,
      true
    ).value;
    return acc;
  }, {});

  const pieChartData = Object.keys(data).reduce((currenciesList, c) => {
    currenciesList.push(data[c]);
    return currenciesList;
  }, []);

  return (
    <div className="currencies">
      <PieChart data={pieChartData} />
    </div>
  );
}

class RenderError extends Component<*> {
  render() {
    return <div className="currencies" />;
  }
}

class RenderLoading extends Component<*> {
  render() {
    return <div className="currencies" />;
  }
}

// TODO we need to have connectData to also connect data?
export default connectData(Currencies, {
  api: {
    accounts: api.accounts,
    currencies: api.currencies
  },
  RenderError,
  RenderLoading
});
