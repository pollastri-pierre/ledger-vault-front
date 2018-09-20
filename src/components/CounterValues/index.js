//@flow
// same as CounterValue but for multiple currencies

import React, { PureComponent } from "react";
import CounterValues from "data/CounterValues";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import type { Account } from "data/types";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById
} from "@ledgerhq/live-common/lib/helpers/currencies";
const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  const countervalue = ownProps.accounts
    .filter(account => account.balance > 0)
    .reduce((acc, account) => {
      const currency = allCurrencies.find(
        curr => curr.id === account.currency.name
      );
      return (
        acc +
        CounterValues.calculateWithIntermediarySelector(state, {
          from: currency,
          fromExchange: state.exchanges.data[currency.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data["USD"],
          to: getFiatCurrencyByTicker("USD"),
          value: account.balance
        })
      );
    }, 0);
  return { countervalue };
};

type Props = {
  countervalue: number,
  accounts: Account[]
};

class CounterValuesAccounts extends PureComponent<Props> {
  render() {
    const { countervalue } = this.props;
    if (!countervalue && countervalue !== 0) {
      return "-";
    }
    return <CurrencyFiatValue fiat="USD" value={countervalue} />;
  }
}

export default connect(mapStateToProps)(CounterValuesAccounts);
