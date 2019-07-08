// @flow

import React, { Component, PureComponent } from "react";
import type { Transaction, Account } from "data/types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import Copy from "components/base/Copy";
import Box from "components/base/Box";
import CurrencyAccountValue from "../CurrencyAccountValue";
import LineRow from "../LineRow";

const TransactionETHDetails = ({
  transaction,
}: {
  transaction: any, // YEAH ANY WHATEVER we need to destroy this component anyway
}) => (
  <Box>
    <LineRow label="FROM" />
    <Copy text={transaction.sender} />
    <LineRow label="To" />
    <Copy text={transaction.receiver} />
  </Box>
);

class TransactionList<T: *> extends Component<{
  account: Account,
  title: string,
  entries: Array<T>,
  dataTest: string,
}> {
  render() {
    const { account, title, entries, dataTest } = this.props;
    return (
      <div>
        <LineRow label={title}>
          <strong data-test={`${dataTest}-currency-unit`}>
            <CurrencyAccountValue
              account={account}
              value={entries.reduce((s, e) => s + e.value, 0)}
              alwaysShowSign
            />
          </strong>
        </LineRow>
        <Box flow={10}>
          {entries.map(e => (
            <div key={e.address}>
              <Copy text={e.address} />
              {entries.length > 1 && (
                <CurrencyAccountValue
                  account={account}
                  value={e.value}
                  alwaysShowSign
                />
              )}
            </div>
          ))}
        </Box>
      </div>
    );
  }
}

class TabDetails extends PureComponent<{
  transaction: Transaction,
  account: Account,
}> {
  render() {
    const { transaction, account } = this.props;
    const { transaction: rawTransaction } = transaction;
    const cryptoCurrency = getCryptoCurrencyById(account.currency);
    if (!rawTransaction) {
      return "No data.";
    }
    return (
      <>
        {rawTransaction && cryptoCurrency.family === "bitcoin" && (
          <>
            <TransactionList
              title="From"
              dataTest="transaction-details-from"
              account={account}
              entries={rawTransaction.inputs}
            />
            <TransactionList
              title="To"
              dataTest="transaction-details-to"
              account={account}
              entries={rawTransaction.outputs}
            />
          </>
        )}
        {cryptoCurrency.family === "ethereum" && (
          <TransactionETHDetails transaction={rawTransaction} />
        )}
      </>
    );
  }
}

export default TabDetails;
