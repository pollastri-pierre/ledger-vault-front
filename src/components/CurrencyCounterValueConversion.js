// @flow
import React, { PureComponent } from "react";
import CounterValues from "data/CounterValues";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
const allCurrencies = listCryptoCurrencies(true);

const mapStateToProps = (state, ownProps) => {
  // const currency = allCurrencies.find(curr => curr.id === ownProps.account.currency.name);
  // const countervalue: CounterValues.reverseSelector(state, {
  //     from: currency,
  //     to: getFiatCurrencyByTicker("USD"),
  //     exchange: "BITFINEX",
  //     value: 1000000
  //   })
  // return {countervalue: 0}
};

// we get currency's name as props and looks for the right currency in ledgerhq currencies
// because currently the API and ledgerHQ don't share the same
// format for Currency

type Props = {
  countervalue: number,
  account: *
};

class CurrencyCounterValueConversion extends PureComponent<Props> {
  render() {
    return null;
  }
}

export default connect(mapStateToProps)(CurrencyCounterValueConversion);
