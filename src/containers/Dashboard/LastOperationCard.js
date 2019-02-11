// @flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import DashboardLastOperationsQuery from "api/queries/DashboardLastOperationsQuery";
import { translate } from "react-i18next";
import AccountsDashboardQuery from "api/queries/AccountsDashboardQuery";
// import ViewAllLink from "components/ViewAllLink";
import TryAgain from "components/TryAgain";
import Card from "components/legacy/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import DataTableOperation from "components/DataTableOperation";
import type { Operation, Account, Translate } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

const columnIds = ["date", "account", "countervalue", "amount"];

class LastOperationCard extends Component<*> {
  props: {
    operations: Connection<Operation>,
    t: Translate,
    accounts: Array<Account>,
    reloading: boolean
  };

  render() {
    const { accounts, operations, reloading, t } = this.props;
    return (
      <Card reloading={reloading} title={t("accountView:last_op.title")}>
        <div data-test="last_op_list">
          <DataTableOperation
            columnIds={columnIds}
            operations={operations.edges.map(e => e.node)}
            accounts={accounts}
          />
        </div>
      </Card>
    );
  }
}

const RenderError = translate()(({ t, restlay, error }: *) => (
  <Card title={t("accountView:last_op.title")}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = translate()(({ t }: { t: Translate }) => (
  <Card title={t("accountView:last_op.title")}>
    <SpinnerCard />
  </Card>
));

const c = connectData(translate()(LastOperationCard), {
  queries: {
    operations: DashboardLastOperationsQuery,
    accounts: AccountsDashboardQuery
  },
  initialVariables: {
    operations: 5
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
export default c;
