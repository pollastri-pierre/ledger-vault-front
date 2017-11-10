//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import DashboardLastOperationsQuery from "../../api/queries/DashboardLastOperationsQuery";
import AccountsQuery from "../../api/queries/AccountsQuery";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import CardLoading from "../../components/utils/CardLoading";
import DataTableOperation from "../../components/DataTableOperation";
import type { Operation, Account } from "../../datatypes";

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>,
    reloading: boolean
  };
  render() {
    const { operations, reloading } = this.props;
    return (
      <Card
        reloading={reloading}
        title="last operations"
        titleRight={<ViewAllLink to="/search" />}
      >
        <DataTableOperation
          columnIds={["date", "account", "countervalue", "amount"]}
          operations={operations}
        />
      </Card>
    );
  }
}

class RenderError extends Component<*> {
  render() {
    return (
      <Card title="last operations" titleRight={<ViewAllLink to="/search" />} />
    );
  }
}

class RenderLoading extends Component<*> {
  render() {
    return (
      <Card title="last operations" titleRight={<ViewAllLink to="/search" />}>
        <CardLoading />
      </Card>
    );
  }
}
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
