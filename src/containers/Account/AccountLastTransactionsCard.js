// @flow

import React, { Component } from "react";
import { withRouter } from "react-router";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import InfiniteScrollable from "components/InfiniteScrollable";
import SpinnerCard from "components/spinners/SpinnerCard";
import { TransactionsTable } from "components/Table";
import TryAgain from "components/TryAgain";
import Card from "components/legacy/Card";

import connectData from "restlay/connectData";
import AccountTransactionsQuery from "api/queries/AccountTransactionsQuery";

import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Account, Transaction } from "data/types";

type Props = {
  account: Account,
  operations: Connection<Transaction>,
  restlay: RestlayEnvironment,
  match: Match,
  history: MemoryHistory,
};

class AccountLastTransactionsCard extends Component<Props> {
  handleTransactionClick = (operation: Transaction) => {
    const { history, match } = this.props;
    history.push(`${match.url}/operation/${operation.id}/0`);
  };

  render() {
    const { account, operations, restlay } = this.props;
    return (
      <Card title="last operations">
        <InfiniteScrollable
          restlay={restlay}
          restlayVariable="operations"
          chunkSize={20}
        >
          <TransactionsTable
            accounts={[account]}
            data={operations.edges.map(e => e.node)}
            onRowClick={this.handleTransactionClick}
          />
        </InfiniteScrollable>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card title="last operations">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card title="last operations">
    <SpinnerCard />
  </Card>
);

export default connectData(withRouter(AccountLastTransactionsCard), {
  queries: {
    operations: AccountTransactionsQuery,
  },
  initialVariables: {
    operations: 20,
  },
  propsToQueryParams: ({ account }: { account: Account }) => ({
    accountId: String(account.id),
  }),
  RenderError,
  RenderLoading,
});
