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

import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import counterValues from "data/counterValues";
import type { Account } from "data/types";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  const countervalue = ownProps.accounts
    .filter(account => account.balance.isGreaterThan(0))
    .reduce((acc, account) => {
      try {
        const curOrToken =
          account.account_type === "ERC20"
            ? getERC20TokenByContractAddress(account.contract_address)
            : getCryptoCurrencyById(account.currency_id);
        if (!curOrToken) return acc;
        const cvalue = counterValues.calculateWithIntermediarySelector(state, {
          // $FlowFixMe I guarantee curOrToken is compatible with CurrencyCommon :doge:
          from: curOrToken,
          fromExchange: curOrToken && state.exchanges.data[curOrToken.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data.USD,
          to: getFiatCurrencyByTicker("USD"),
          value: account.balance,
        });
        return cvalue && !cvalue.isNaN() ? acc.plus(cvalue) : acc;
      } catch (err) {
        console.error(err);
        return acc;
      }
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
