// @flow

import React from "react";
import { withRouter } from "react-router";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchTransactions from "api/queries/SearchTransactions";
import { SoftCard } from "components/base/Card";
import VaultLink from "components/VaultLink";
import type { Account, Transaction } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import { TransactionsTable } from "components/Table";
import { defaultDefinition as defaultTableDefinition } from "components/Table/TransactionsTable";
import Widget, { connectWidget } from "./Widget";

type Props = {
  account: Account,
  transactions: Connection<Transaction>,
  history: MemoryHistory,
  location: Location,
};

const tableDefinition = defaultTableDefinition.filter(
  col => col.body.prop !== "name",
);

function AccountLastTransactionsWidget(props: Props) {
  const { account, transactions, history, location } = props;
  const onRowClick = (transaction: Transaction) => {
    history.push(
      `${location.pathname}/transactions/details/${transaction.id}/overview`,
    );
  };
  const desc = (
    <VaultLink withRole to={`/transactions?account=${account.id}`}>
      View all
    </VaultLink>
  );
  return (
    <Widget title="Last transactions" desc={desc}>
      <SoftCard style={{ padding: 0 }}>
        <TransactionsTable
          customTableDef={tableDefinition}
          accounts={[account]}
          data={transactions.edges.map(e => e.node)}
          onRowClick={onRowClick}
        />
      </SoftCard>
    </Widget>
  );
}

export default withRouter(
  connectWidget(AccountLastTransactionsWidget, {
    height: 300,
    queries: {
      transactions: SearchTransactions,
    },
    propsToQueryParams: ({ account }: { account: Account }) => ({
      account: [account.id],
    }),
  }),
);
