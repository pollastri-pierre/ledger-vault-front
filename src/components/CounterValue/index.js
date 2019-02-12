// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";

import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import colors from "shared/colors";
import CounterValues from "data/CounterValues";
import Text from "components/base/Text";

import type { TransactionType } from "data/types";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  const currency = getCryptoCurrencyById(ownProps.from);
  if (ownProps.disableCountervalue) {
    return {};
  }
  return {
    countervalue: CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange: currency && state.exchanges.data[currency.ticker],
      intermediary: intermediaryCurrency,
      toExchange: state.exchanges.data.USD,
      to: getFiatCurrencyByTicker("USD"),
      value: ownProps.value
    })
  };
};

// we get currency's name as props and looks for the right currency in ledgerhq currencies
// because currently the API and ledgerHQ don't share the same format for Currency

type Props = {
  countervalue: ?number,
  value: number, // eslint-disable-line react/no-unused-prop-types
  from: string, // eslint-disable-line react/no-unused-prop-types
  alwaysShowSign?: boolean,
  type?: TransactionType
};

class CounterValue extends PureComponent<Props> {
  render() {
    const { countervalue, alwaysShowSign, type } = this.props;
    if (!countervalue && countervalue !== 0) {
      return (
        <Text inline color={colors.mediumGrey}>
          N/A
        </Text>
      );
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
