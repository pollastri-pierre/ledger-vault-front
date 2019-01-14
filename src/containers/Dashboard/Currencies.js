//@flow
import React from "react";
import { connect } from "react-redux";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

import PieChart from "components/PieChart";
import type { Account } from "data/types";
import AccountsQuery from "api/queries/AccountsQuery";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import CounterValues from "data/CounterValues";
import connectData from "restlay/connectData";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

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
      const currency_id = account.currency_id;
      const currency = getCryptoCurrencyById(currency_id);
      const balance = account.balance;
      //check if currency already added
      if (!acc[currency_id]) {
        acc[currency_id] = {
          account,
          balance: 0,
          counterValueBalance: 0
        };
      }
      acc[currency_id].balance += balance;

      const cvalue = CounterValues.calculateWithIntermediarySelector(state, {
        from: currency,
        to: getFiatCurrencyByTicker("USD"),
        fromExchange: currency && state.exchanges.data[currency.ticker],
        intermediary: intermediaryCurrency,
        toExchange: state.exchanges.data["USD"],
        value: balance
      });

      if (!isNaN(cvalue)) {
        acc[currency_id].counterValueBalance += cvalue;
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
