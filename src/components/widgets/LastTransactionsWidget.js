// @flow

import React from "react";
import { Trans } from "react-i18next";
import AccountsQuery from "api/queries/AccountsQuery";
import { withRouter } from "react-router";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import Card from "components/base/Card";
import SearchTransactions from "api/queries/SearchTransactions";
import VaultLink from "components/VaultLink";
import { TransactionsList } from "components/lists";
import type { Connection } from "restlay/ConnectionQuery";
import { TransactionStatusMap } from "data/types";
import type { Account, Transaction } from "data/types";
import Widget, { connectWidget } from "./Widget";

type Props = {
  data: Connection<Transaction>,
  accounts: Connection<Account>,
  history: MemoryHistory,
  location: Location,
};

function LastTransactionsWidget(props: Props) {
  const { data, accounts, history, location } = props;
  const onTransactionClick = (transaction: Transaction) => {
    history.push(
      `${location.pathname}/transactions/details/${transaction.id}/overview`,
    );
  };

  const desc = (
    <VaultLink withRole to="/transactions">
      View all
    </VaultLink>
  );
  const transactions = data.edges.map(el => el.node);
  const allAccounts = accounts.edges.map(el => el.node);

  return (
    <Widget title="Last transactions" desc={desc}>
      <Card style={{ padding: 0 }}>
        <TransactionsList
          emptyState={<Trans i18nKey="operatorDashboard:transactionsEmpty" />}
          dataTest="operator-dashboard-transactions"
          transactions={transactions}
          accounts={allAccounts}
          onTransactionClick={onTransactionClick}
        />
      </Card>
    </Widget>
  );
}

// FIXME had to double connectWidget() because propsToQueryParams apply
// to all queries
// other alternative is to create a custom query
const height = 300;
const defaultNumber = 10;
export default withRouter(
  connectWidget(
    connectWidget(LastTransactionsWidget, {
      height,
      queries: {
        data: SearchTransactions,
      },
      propsToQueryParams: props => ({
        status: TransactionStatusMap.SUBMITTED,
        pageSize: props.number || defaultNumber,
      }),
    }),
    {
      height,
      queries: {
        accounts: AccountsQuery,
      },
    },
  ),
);
