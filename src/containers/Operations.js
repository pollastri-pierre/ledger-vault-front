// @flow

import React, { PureComponent, Fragment } from "react";
import type { MemoryHistory } from "history";
import type { Match } from "react-router-dom";

import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import SearchOperationsQuery from "api/queries/SearchOperations";

import { OperationsTable } from "components/Table";
import { OperationsFilters } from "components/filters";
import { CardLoading, CardError } from "components/base/Card";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";

import DataSearch from "components/DataSearch";

import type { Account, Operation } from "data/types";

type Props = {
  history: MemoryHistory,
  match: Match,
  accounts: Account[],
};

class OperationsContainer extends PureComponent<Props> {
  handleOperationClick = (operation: Operation) => {
    const { history, match } = this.props;
    history.push(`${match.url}/operation/${operation.id}/0`);
  };

  render() {
    const { accounts, history, match } = this.props;
    return (
      <Fragment>
        <DataSearch
          Query={SearchOperationsQuery}
          TableComponent={OperationsTable}
          FilterComponent={OperationsFilters}
          extraProps={{ accounts }}
          history={history}
          onRowClick={this.handleOperationClick}
        />
        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </Fragment>
    );
  }
}

export default connectData(OperationsContainer, {
  queries: {
    accounts: AccountsQuery,
  },
  RenderLoading: CardLoading,
  RenderError: CardError,
});
