//@flow
import React from "react";
import CounterValues from "data/CounterValues";
import connectData from "restlay/connectData";
import { connect } from "react-redux";
import PieChart from "components/PieChart";
import type { Account } from "data/types";
import AccountsQuery from "api/queries/AccountsQuery";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById
} from "@ledgerhq/live-common/lib/helpers/currencies";
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");
const allCurrencies = listCryptoCurrencies(true);

type AggregatedData = {
  [_: string]: {
    account: Account,
    balance: number,
    counterValueBalance: number
  }
};

const mapStateToProps = (state, ownProps) => {
  const data: AggregatedData = ownProps.accounts.reduce(
    (acc: AggregatedData, account) => {
      const currency_name = account.currency.name;
      const currency = allCurrencies.find(curr => curr.id === currency_name);
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

      const cvalue = CounterValues.calculateWithIntermediarySelector(state, {
        from: currency,
        to: getFiatCurrencyByTicker("USD"),
        fromExchange: state.exchanges.data[currency.ticker],
        intermediary: intermediaryCurrency,
        toExchange: state.exchanges.data["USD"],
        value: balance
      });

      if (!isNaN(cvalue)) {
        acc[currency_name].counterValueBalance += cvalue;
      }
      return acc;
    },
    {}
  );
  return {
    pieChartData: Object.keys(data).reduce((currenciesList, c) => {
      currenciesList.push(data[c]);
      return currenciesList;
    }, [])
  };
};
function Currencies({ pieChartData }: { pieChartData: Object }) {
  return (
    <div>
      <PieChart
        data={pieChartData}
        showCaptions
        showTooltips
        highlightCaptionsOnHover
        radius={70}
      />
    </div>
  );
}

const RenderError = ({ error, restlay }: *) => (
  <div>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
);

const RenderLoading = () => (
  <div>
    <SpinnerCard />
  </div>
);

export default connectData(connect(mapStateToProps)(Currencies), {
  queries: {
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
