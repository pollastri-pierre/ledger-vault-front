// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById,
  listCryptoCurrencies
} from "@ledgerhq/live-common/lib/helpers/currencies";

import type { TransactionType } from "data/types";
import CounterValues from "data/CounterValues";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");
const allCurrencies = listCryptoCurrencies(true);

const mapStateToProps = (state, ownProps) => {
  const currency = allCurrencies.find(curr => curr.id === ownProps.from);
  return {
    countervalue: CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange: currency && state.exchanges.data[currency.ticker],
      intermediary: intermediaryCurrency,
      toExchange: state.exchanges.data["USD"],
      to: getFiatCurrencyByTicker("USD"),
      value: ownProps.value
    })
  };
};

// we get currency's name as props and looks for the right currency in ledgerhq currencies
// because currently the API and ledgerHQ don't share the same format for Currency

type Props = {
  countervalue: number,
  value: number,
  from: string,
  alwaysShowSign?: boolean,
  type?: TransactionType
};

class CounterValue extends PureComponent<Props> {
  render() {
    const { countervalue, alwaysShowSign, type } = this.props;
    if (!countervalue && countervalue !== 0) {
      return "-";
    }
    return (
      <CurrencyFiatValue
        fiat="USD"
        value={countervalue}
        alwaysShowSign={alwaysShowSign}
        type={type}
      />
    );
  }
}

export default connect(mapStateToProps)(CounterValue);
