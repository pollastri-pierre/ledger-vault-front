// @flow
// same as CounterValue but for multiple currencies
import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById,
} from "@ledgerhq/live-common/lib/currencies";

import CounterValues from "data/CounterValues";
import type { Account } from "data/types";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  const countervalue = ownProps.accounts
    .filter(account => account.balance > 0 && account.account_type !== "ERC20")
    .reduce((acc, account) => {
      const currency = getCryptoCurrencyById(account.currency);
      return acc.plus(
        CounterValues.calculateWithIntermediarySelector(state, {
          from: currency,
          fromExchange: currency && state.exchanges.data[currency.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data.USD,
          to: getFiatCurrencyByTicker("USD"),
          value: account.balance,
        }),
      );
    }, BigNumber(0));
  return { countervalue };
};

type Props = {
  countervalue: BigNumber,
  accounts: Account[], // eslint-disable-line react/no-unused-prop-types
};

class CounterValuesAccounts extends PureComponent<Props> {
  render() {
    const { countervalue } = this.props;
    if (countervalue.isNaN()) {
      return "-";
    }
    return <CurrencyFiatValue fiat="USD" value={countervalue} />;
  }
}

export default connect(mapStateToProps)(CounterValuesAccounts);
