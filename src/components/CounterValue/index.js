// @flow
import React, { PureComponent } from "react";
import CounterValues from "data/CounterValues";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById
} from "@ledgerhq/live-common/lib/helpers/currencies";
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");
const allCurrencies = listCryptoCurrencies(true);

const mapStateToProps = (state, ownProps) => {
  const currency = allCurrencies.find(curr => curr.id === ownProps.from);
  return {
    countervalue: CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange: state.exchanges.data[currency.ticker],
      intermediary: intermediaryCurrency,
      toExchange: state.exchanges.data["USD"],
      to: getFiatCurrencyByTicker("USD"),
      value: ownProps.value
    })
  };
};

// we get currency's name as props and looks for the right currency in ledgerhq currencies
// because currently the API and ledgerHQ don't share the same
// format for Currency

type Props = {
  countervalue: number,
  value: number,
  from: string
};

class CounterValue extends PureComponent<Props> {
  render() {
    const { countervalue } = this.props;
    if (!countervalue && countervalue !== 0) {
      return "-";
    }
    return <CurrencyFiatValue fiat="USD" value={countervalue} />;
  }
}

export default connect(mapStateToProps)(CounterValue);
