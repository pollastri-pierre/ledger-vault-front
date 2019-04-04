// @flow
import React from "react";
import { connect } from "react-redux";
import {
  getCryptoCurrencyById,
  getFiatCurrencyByTicker
} from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";

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
    balance: BigNumber,
    counterValueBalance: BigNumber
  }
};

const mapStateToProps = (state, ownProps) => {
  const data: AggregatedData = ownProps.accounts.reduce(
    (acc: AggregatedData, account) => {
      // ignore erc20 tokens
      if (account.account_type === "ERC20") {
        return acc;
      }

      const currency_id = account.currency_id;
      const currency = getCryptoCurrencyById(currency_id);
      const balance = account.balance;
      // check if currency already added
      if (!acc[currency_id]) {
        acc[currency_id] = {
          account,
          balance: BigNumber(0),
          counterValueBalance: BigNumber(0)
        };
      }
      acc[currency_id].balance = acc[currency_id].balance.plus(balance);

      const cvalue = CounterValues.calculateWithIntermediarySelector(state, {
        from: currency,
        to: getFiatCurrencyByTicker("USD"),
        fromExchange: currency && state.exchanges.data[currency.ticker],
        intermediary: intermediaryCurrency,
        toExchange: state.exchanges.data.USD,
        value: balance
      });

      if (cvalue && !cvalue.isNaN()) {
        acc[currency_id].counterValueBalance = acc[
          currency_id
        ].counterValueBalance.plus(cvalue);
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
