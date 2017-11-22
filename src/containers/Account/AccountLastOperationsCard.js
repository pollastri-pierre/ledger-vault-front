// @flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import Card from "../../components/Card";
import AccountOperationsQuery from "../../api/queries/AccountOperationsQuery";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import DataTableOperation from "../../components/DataTableOperation";
import type { Account, Operation } from "../../data/types";

class AccountLastOperationsCard extends Component<{
  accountId: string,
  account: Account,
  operations: Operation[],
  reloading: boolean
}> {
  render() {
    const { account, operations, reloading } = this.props;
    return (
      <Card reloading={reloading} title="last operations">
        <DataTableOperation
          accounts={[account]}
          operations={operations}
          columnIds={["date", "address", "status", "countervalue", "amount"]}
        />
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
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
