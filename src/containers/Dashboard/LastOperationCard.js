//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import DashboardLastOperationsQuery from "api/queries/DashboardLastOperationsQuery";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import AccountsQuery from "api/queries/AccountsQuery";
// import ViewAllLink from "components/ViewAllLink";
import TryAgain from "components/TryAgain";
import Card from "components/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import DataTableOperation from "components/DataTableOperation";
import type { Operation, Account } from "data/types";

const columnIds = ["date", "account", "countervalue", "amount"];

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>,
    t: Translate,
    accounts: Array<Account>,
    reloading: boolean
  };
  render() {
    const { accounts, operations, reloading, t } = this.props;
    return (
      <Card reloading={reloading} title={t("accountView:last_op.title")}>
        <DataTableOperation
          columnIds={columnIds}
          operations={operations}
          accounts={accounts}
        />
      </Card>
    );
  }
}

const RenderError = translate()(({ t, restlay, error }: *) => (
  <Card title={t("accountView:last_op.title")}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = translate()(({ t }, { t: Translate }) => (
  <Card title={t("accountView:last_op.title")}>
    <SpinnerCard />
  </Card>
));

const c = connectData(translate()(LastOperationCard), {
  queries: {
    operations: DashboardLastOperationsQuery,
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
export default c;
