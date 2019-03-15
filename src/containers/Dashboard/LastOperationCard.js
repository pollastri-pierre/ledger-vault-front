// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withRouter } from "react-router";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import connectData from "restlay/connectData";
import DashboardLastOperationsQuery from "api/queries/DashboardLastOperationsQuery";
import AccountsDashboardQuery from "api/queries/AccountsDashboardQuery";

import TryAgain from "components/TryAgain";
import Card from "components/legacy/Card";
import SpinnerCard from "components/spinners/SpinnerCard";
import { OperationsTable } from "components/Table";

import type { Operation, Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  operations: Connection<Operation>,
  accounts: Array<Account>,
  reloading: boolean,
  match: Match,
  history: MemoryHistory,
};

class LastOperationCard extends Component<Props> {
  handleOperationClick = (operation: Operation) => {
    const { history, match } = this.props;
    history.push(`${match.url}/operation/${operation.id}/0`);
  };

  render() {
    const { accounts, operations, reloading } = this.props;
    return (
      <Card
        reloading={reloading}
        title={<Trans i18nKey="accountView:last_op.title" />}
      >
        <div data-test="last_op_list">
          <OperationsTable
            data={operations.edges.map(e => e.node)}
            accounts={accounts}
            onRowClick={this.handleOperationClick}
          />
        </div>
      </Card>
    );
  }
}

const RenderError = ({
  restlay,
  error,
}: {
  restlay: RestlayEnvironment,
  error: Error,
}) => (
  <Card title={<Trans i18nKey="accountView:last_op.title" />}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card title={<Trans i18nKey="accountView:last_op.title" />}>
    <SpinnerCard />
  </Card>
);

const c = connectData(withRouter(LastOperationCard), {
  queries: {
    operations: DashboardLastOperationsQuery,
    accounts: AccountsDashboardQuery,
  },
  initialVariables: {
    operations: 5,
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading,
});

export default c;
