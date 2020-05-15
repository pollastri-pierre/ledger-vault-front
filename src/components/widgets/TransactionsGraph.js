// @flow

import React from "react";

import SearchTransactions from "api/queries/SearchTransactions";
import type { Connection } from "restlay/ConnectionQuery";
import BalanceGraph from "components/BalanceGraph";
import { SoftCard } from "components/base/Card";
import type { Account, Transaction } from "data/types";
import Widget, { connectWidget } from "./Widget";

type Props = {
  transactions: Connection<Transaction>,
  account: Account,
};

function TransactionsGraph(props: Props) {
  const { transactions, account } = props;

  return (
    <Widget title="Your balance during the last 30 days">
      <SoftCard>
        <BalanceGraph
          height={400}
          transactions={
            transactions.edges ? transactions.edges.map((el) => el.node) : []
          }
          account={account}
          nbDays={30}
        />
      </SoftCard>
    </Widget>
  );
}

const start = new Date();
start.setMonth(start.getMonth() - 1);

export default connectWidget(TransactionsGraph, {
  height: 426,
  queries: {
    transactions: SearchTransactions,
  },
  propsToQueryParams: ({ account }: { account: Account }) => {
    return {
      account: [account.id],
      status: "SUBMITTED",
      start: start.toISOString(),
    };
  },
});
