// @flow

import React, { PureComponent } from "react";
import Tooltip from "components/base/Tooltip";
import { FaInfoCircle } from "react-icons/fa";
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

import colors from "shared/colors";

type CurOrToken = {
  ticker: string,
};

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, ownProps) => {
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

  return { countervalue, exchange: state.exchanges.data.USD };
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
    if (fromAccount.account_type === "Erc20") {
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
  countervalue: ?BigNumber,
  exchange: string,
  value: BigNumber, // eslint-disable-line react/no-unused-prop-types
  from?: string, // eslint-disable-line react/no-unused-prop-types
  fromAccount?: Account, // eslint-disable-line react/no-unused-prop-types
  disableTooltip?: boolean,
  alwaysShowSign?: boolean,
  type?: TransactionType,
  renderNA?: React$Node,
  smallerInnerMargin?: boolean,
};

class CounterValue extends PureComponent<Props> {
  render() {
    const {
      value,
      countervalue,
      alwaysShowSign,
      type,
      renderNA,
      exchange,
      disableTooltip,
      smallerInnerMargin,
    } = this.props;
    if (!countervalue) {
      return renderNA || <span>N/A</span>;
    }

    // display specific string if value is lower than 0.01 USD
    // see https://ledgerhq.atlassian.net/browse/LV-828
    let inner;
    if (value.isGreaterThan(0) && countervalue.isEqualTo(0)) {
      inner = "< USD 0.01";
    } else {
      inner = (
        <CurrencyFiatValue
          fiat="USD"
          value={countervalue}
          alwaysShowSign={alwaysShowSign}
          type={type}
        />
      );
    }

    // we use <span> here instead of <Box> because <CounterValue/> is renderered
    // a lot in table, in cell with align:right, so we want to keep it "inline"
    // to not break the alignment
    return disableTooltip ? (
      inner
    ) : (
      <span style={{ whiteSpace: "nowrap" }}>
        {inner}
        <span
          style={{
            display: "inline-block",
            marginLeft: smallerInnerMargin ? 4 : 8,
            verticalAlign: "middle",
            lineHeight: 1,
          }}
        >
          <Tooltip content={`Source: ${exchange}`}>
            <FaInfoCircle size={12} color={colors.mouse} />
          </Tooltip>
        </span>
      </span>
    );
  }
}

export default connect(mapStateToProps)(CounterValue);
