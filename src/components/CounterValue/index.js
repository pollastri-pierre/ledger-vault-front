// @flow

import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById,
} from "@ledgerhq/live-common/lib/currencies";

import CurrencyFiatValue from "components/CurrencyFiatValue";
import type { TransactionType, Account } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import counterValues from "data/counterValues";

type CurOrToken = {
  ticker: string,
};

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
  if (ownProps.disableCountervalue) {
    return {};
  }

  const curOrToken = resolveCurOrToken({
    from: ownProps.from,
    fromAccount: ownProps.fromAccount,
  });

  if (!curOrToken) {
    return {};
  }

  const countervalue = counterValues.calculateWithIntermediarySelector(state, {
    // $FlowFixMe I guarantee curOrToken is compatible with CurrencyCommon :doge:
    from: curOrToken,
    fromExchange: state.exchanges.data[curOrToken.ticker],
    intermediary: intermediaryCurrency,
    toExchange: state.exchanges.data.USD,
    to: getFiatCurrencyByTicker("USD"),
    value: ownProps.value,
  });

  return { countervalue };
};

function resolveCurOrToken({
  from,
  fromAccount,
}: {
  from?: string,
  fromAccount?: Account,
}): CurOrToken | null {
  if (from) {
    const currency = getCryptoCurrencyById(from);
    if (!currency) return null;
    return { ticker: currency.ticker };
  }
  if (fromAccount) {
    if (fromAccount.account_type === "ERC20") {
      const token = getERC20TokenByContractAddress(
        fromAccount.contract_address,
      );
      if (!token) return null;
      return { ticker: token.ticker };
    }
    const currency = getCryptoCurrencyById(fromAccount.currency);
    if (!currency) return null;
    return { ticker: currency.ticker };
  }
  return null;
}

// we get currency's name as props and looks for the right currency in ledgerhq currencies
// because currently the API and ledgerHQ don't share the same format for Currency

type Props = {
  countervalue: ?number,
  value: BigNumber, // eslint-disable-line react/no-unused-prop-types
  from?: string, // eslint-disable-line react/no-unused-prop-types
  fromAccount?: Account, // eslint-disable-line react/no-unused-prop-types
  alwaysShowSign?: boolean,
  type?: TransactionType,
  renderNA?: React$Node,
};

class CounterValue extends PureComponent<Props> {
  render() {
    const { countervalue, alwaysShowSign, type, renderNA } = this.props;
    if (!countervalue) {
      return renderNA || "N/A";
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
