//@flow
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import { connect } from "react-redux";
import React, { Component } from "react";
import PieChart from "./PieChart";
import { inferUnitValue } from "../../data/currency";
import type { Account } from "../../datatypes";

function Currencies({ accounts, data }: { accounts: Array<Account>, data: * }) {
  //compute currencies from accounts balance
  const computedCurrencies = accounts.reduce((currencies, account) => {
    const currency_name = account.currency.name;
    const balance = account.balance;
    //check if currency already added
    if (!currencies[currency_name]) {
      currencies[currency_name] = {
        meta: account.currency,
        balance: 0,
        counterValueBalance: 0
      };
    }
    currencies[currency_name].balance += balance;
    currencies[currency_name].counterValueBalance += inferUnitValue(
      data,
      currency_name,
      balance,
      true
    ).value;
    return currencies;
  }, {});

  const pieChartData = Object.keys(
    computedCurrencies
  ).reduce((currenciesList, currencies) => {
    currenciesList.push(computedCurrencies[currencies]);
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
export default connect(({ data }) => ({ data }), () => ({}))(
  connectData(Currencies, {
    api: {
      accounts: api.accounts
    },
    RenderError,
    RenderLoading
  })
);
