// @flow
import React, { PureComponent, Fragment } from "react";
import type { MemoryHistory } from "history";
import type { Match } from "react-router-dom";

import RequestsQuery from "api/queries/RequestsQuery";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";

import RequestsTable from "components/Table/RequestsTable";
import { RequestsFilters } from "components/filters";
import DataSearch from "components/DataSearch";
import ModalRoute from "components/ModalRoute";
import RequestDetails from "containers/RequestDetails";

import type { Request } from "data/types";

type Props = {
  history: MemoryHistory,
  match: Match,
};

const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];

class Users extends PureComponent<Props> {
  handleUserClick = (request: Request) => {
    this.props.history.push(`tasks/requests/${request.id}`);
  };

  render() {
    const { history, match } = this.props;
    return (
      <Fragment>
        <DataSearch
          Query={RequestsQuery}
          TableComponent={RequestsTable}
          FilterComponent={RequestsFilters}
          history={history}
          onRowClick={this.handleUserClick}
          listenMutations={mutationsToListen}
        />
        <ModalRoute
          path={`${match.url}/requests/:requestID`}
          component={RequestDetails}
        />
      </Fragment>
    );
  }
}

export default Users;
