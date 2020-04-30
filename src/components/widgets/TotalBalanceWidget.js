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

  const totalBalance = reduceAccountsValue(
    state,
    accounts,
    account => account.balance,
  );

  const totalPendingTransaction = reduceAccountsValue(
    state,
    accounts,
    account => account.balance.minus(account.available_balance),
  );

  return {
    totalBalance,
    totalPendingTransaction,
  };
};

type Props = {
  totalBalance: BigNumber,
  totalPendingTransaction: BigNumber,
};

function TotalBalanceWidget(props: Props) {
  const { totalBalance, totalPendingTransaction } = props;
  return (
    <Widget title="Total balance" height={150}>
      <Card grow align="center" justify="center">
        <Text style={{ fontSize: 36 }}>
          <CurrencyFiatValue fiat="USD" value={totalBalance} />
        </Text>
        {totalPendingTransaction.isGreaterThan(0) && (
          <Text>
            Pending debit{" "}
            <CurrencyFiatValue fiat="USD" value={totalPendingTransaction} />
          </Text>
        )}
      </Card>
    </Widget>
  );
}

function resolveFrom(account: Account) {
  if (account.account_type === "Erc20") {
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
    meta_status: "APPROVED",
    pageSize: -1,
  }),
});

function reduceAccountsValue(state, accounts, extractValueFromAccount) {
  return accounts.reduce((total, account) => {
    try {
      const from = resolveFrom(account);
      if (!from) return total;
      const pendingTransactionCountervalue = counterValues.calculateWithIntermediarySelector(
        state,
        {
          // $FlowFixMe I guarantee curOrToken is compatible with CurrencyCommon :doge:
          from,
          fromExchange: state.exchanges.data[from.ticker],
          intermediary: intermediaryCurrency,
          toExchange: state.exchanges.data.USD,
          to: getFiatCurrencyByTicker("USD"),
          value: extractValueFromAccount(account),
        },
      );

      if (!pendingTransactionCountervalue) return total;
      return total.plus(pendingTransactionCountervalue);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      return total;
    }
  }, BigNumber(0));
}
