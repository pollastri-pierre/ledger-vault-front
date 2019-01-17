// @flow
// same as CounterValue but for multiple currencies

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import CounterValues from "data/CounterValues";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import type { Operation, Account } from "data/types";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  const countervalue = ownProps.operations.reduce((acc, operation) => {
    const account = ownProps.accounts.find(
      account => account.id === operation.account_id
    );
    if (account) {
      const currency = getCryptoCurrencyById(account.currency_id);
      return (
        acc +
        CounterValues.calculateWithIntermediarySelector(state, {
          from: currency,
          to: getFiatCurrencyByTicker("USD"),
          fromExchange: currency && state.exchanges.data[currency.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data.USD,
          value: operation.price.amount
        })
      );
    }
    return acc + 0;
  }, 0);
  return { countervalue };
};

type Props = {
  countervalue: number,
  accounts: Account[], // eslint-disable-line react/no-unused-prop-types
  operations: Operation[] // eslint-disable-line react/no-unused-prop-types
};

class CounterValuesOperations extends PureComponent<Props> {
  render() {
    const { countervalue } = this.props;
    if (!countervalue && countervalue !== 0) {
      return "-";
    }
    return <CurrencyFiatValue fiat="USD" value={countervalue} />;
  }
}

export default connect(mapStateToProps)(CounterValuesOperations);
