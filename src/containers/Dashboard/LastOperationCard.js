//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import DashboardLastOperationsQuery from "../../api/queries/DashboardLastOperationsQuery";
import AccountsQuery from "../../api/queries/AccountsQuery";
import ViewAllLink from "../../components/ViewAllLink";
import TryAgain from "../../components/TryAgain";
import Card from "../../components/Card";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import DataTableOperation from "../../components/DataTableOperation";
import type { Operation, Account } from "../../data/types";

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>,
    reloading: boolean
  };
  render() {
    const { accounts, operations, reloading } = this.props;
    return (
      <Card
        reloading={reloading}
        title="last operations"
        titleRight={<ViewAllLink to="/search" />}
      >
        <DataTableOperation
          columnIds={["date", "account", "countervalue", "amount"]}
          operations={operations}
          accounts={accounts}
        />
      </Card>
    );
  }
}

const RenderError = ({ restlay, error }: *) => (
  <Card title="last operations" titleRight={<ViewAllLink to="/search" />}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card title="last operations" titleRight={<ViewAllLink to="/search" />}>
    <SpinnerCard />
  </Card>
);

const c = connectData(LastOperationCard, {
  queries: {
    operations: DashboardLastOperationsQuery,
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
export default c;
