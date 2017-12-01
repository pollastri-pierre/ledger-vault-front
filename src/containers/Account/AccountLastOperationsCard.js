// @flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import Card from "../../components/Card";
import AccountOperationsQuery from "../../api/queries/AccountOperationsQuery";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import DataTableOperation from "../../components/DataTableOperation";
import InfiniteScrollable from "../../components/InfiniteScrollable";
import type { Account, Operation } from "../../data/types";
import type { Connection } from "../../restlay/ConnectionQuery";

const columnIds = ["date", "address", "status", "countervalue", "amount"];

class AccountLastOperationsCard extends Component<{
  accountId: string,
  account: Account,
  operations: Connection<Operation>,
  restlay: *
}> {
  render() {
    const { account, operations, restlay } = this.props;
    return (
      <Card title="last operations">
        <InfiniteScrollable
          restlay={restlay}
          restlayVariable="operations"
          chunkSize={5}
        >
          <DataTableOperation
            accounts={[account]}
            operations={operations.edges.map(e => e.node)}
            columnIds={columnIds}
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

export default connectData(AccountLastOperationsCard, {
  queries: {
    account: AccountQuery,
    operations: AccountOperationsQuery
  },
  initialVariables: {
    operations: 20
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  RenderError,
  RenderLoading
});
