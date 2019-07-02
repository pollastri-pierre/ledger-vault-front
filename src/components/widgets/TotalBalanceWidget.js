// @flow

import React from "react";
import { connect } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  getFiatCurrencyByTicker,
  getCryptoCurrencyById,
} from "@ledgerhq/live-common/lib/currencies";

import counterValues from "data/counterValues";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import SearchAccounts from "api/queries/SearchAccounts";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import Card from "components/base/Card";
import Text from "components/base/Text";
import type { Account } from "data/types";
import Widget, { connectWidget } from "./Widget";

const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const mapStateToProps = (state, props) => {
  const { accountsConnection } = props;
  const accounts = accountsConnection.edges.map(e => e.node);
  const totalBalance = accounts.reduce((total, account) => {
    const from = resolveFrom(account);
    if (!from) return total;
    const countervalue = counterValues.calculateWithIntermediarySelector(
      state,
      {
        // $FlowFixMe I guarantee curOrToken is compatible with CurrencyCommon :doge:
        from,
        fromExchange: state.exchanges.data[from.ticker],
        intermediary: intermediaryCurrency,
        toExchange: state.exchanges.data.USD,
        to: getFiatCurrencyByTicker("USD"),
        value: account.balance,
      },
    );
    return total.plus(countervalue);
  }, BigNumber(0));

  return {
    totalBalance,
  };
};

type Props = {
  totalBalance: BigNumber,
};

function TotalBalanceWidget(props: Props) {
  const { totalBalance } = props;
  return (
    <Widget title="Total balance" height={150}>
      <Card grow align="center" justify="center">
        <Text style={{ fontSize: 36 }}>
          <CurrencyFiatValue fiat="USD" value={totalBalance} />
        </Text>
      </Card>
    </Widget>
  );
}

function resolveFrom(account: Account) {
  if (account.account_type === "ERC20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) return null;
    return { ticker: token.ticker };
  }
  const currency = getCryptoCurrencyById(account.currency);
  if (!currency) return null;
  return { ticker: currency.ticker };
}

export default connectWidget(connect(mapStateToProps)(TotalBalanceWidget), {
  height: 150,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: () => ({
    meta_status: "ACTIVE",
    pageSize: -1,
  }),
});
