//@flow
import _ from "lodash";
import { connect } from "react-redux";
import React from "react";
import PieChart from "./PieChart";
import { inferUnitValue } from "../../data/currency";
import type { Account } from "../../datatypes";

function Currencies({ accounts, data }: { accounts: Array<Account>, data: * }) {
  //compute currencies from accounts balance
  const computedCurrencies = _.reduce(
    accounts,
    (currencies, account) => {
      const currency_name = account.currency.name;
      const balance = account.balance;
      //check if currency already added
      if (_.isNil(currencies[currency_name]))
        currencies[currency_name] = {
          meta: account.currency,
          balance: 0,
          counterValueBalance: 0
        };
      currencies[currency_name].balance += balance;
      currencies[currency_name].counterValueBalance += inferUnitValue(
        data,
        currency_name,
        balance,
        true
      ).value;
      return currencies;
    },
    {}
  );

  const pieChartData = _.reduce(
    Object.keys(computedCurrencies),
    (currenciesList, currencies) => {
      currenciesList.push(computedCurrencies[currencies]);
      return currenciesList;
    },
    []
  );

  return (
    <div className="currencies">
      <PieChart data={pieChartData} />
    </div>
  );
}

export default connect(({ data }) => ({ data }), () => ({}))(Currencies);
