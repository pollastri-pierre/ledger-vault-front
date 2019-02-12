// @flow

import React, { Component } from "react";
import { withRouter } from "react-router";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import InfiniteScrollable from "components/InfiniteScrollable";
import SpinnerCard from "components/spinners/SpinnerCard";
import { OperationsTable } from "components/Table";
import TryAgain from "components/TryAgain";
import Card from "components/legacy/Card";

import connectData from "restlay/connectData";
import AccountOperationsQuery from "api/queries/AccountOperationsQuery";

import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Account, Operation } from "data/types";

type Props = {
  account: Account,
  operations: Connection<Operation>,
  restlay: RestlayEnvironment,
  match: Match,
  history: MemoryHistory
};

class AccountLastOperationsCard extends Component<Props> {
  handleOperationClick = (operation: Operation) => {
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
          <OperationsTable
            accounts={[account]}
            operations={operations.edges.map(e => e.node)}
            onOperationClick={this.handleOperationClick}
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

export default connectData(withRouter(AccountLastOperationsCard), {
  queries: {
    operations: AccountOperationsQuery
  },
  initialVariables: {
    operations: 20
  },
  propsToQueryParams: ({ account }: { account: Account }) => ({
    accountId: String(account.id)
  }),
  RenderError,
  RenderLoading
});
