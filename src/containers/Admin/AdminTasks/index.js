// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";

import RequestsQuery from "api/queries/RequestsQuery";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";

import RequestsTable from "components/Table/RequestsTable";
import { RequestsFilters } from "components/filters";
import DataSearch from "components/DataSearch";

import type { Request } from "data/types";

type Props = {
  history: MemoryHistory,
};

const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];

class Users extends PureComponent<Props> {
  handleRowClick = (request: Request) => {
    if (request.target_type === "GROUP") {
      this.props.history.push(`tasks/groups/details/${request.target_id}`);
    } else if (request.target_type === "PERSON") {
      this.props.history.push(`tasks/users/details/${request.target_id}`);
    } else if (
      request.target_type === "BITCOIN_ACCOUNT" ||
      request.target_type === "ETHEREUM_ACCOUNT"
    ) {
      this.props.history.push(`tasks/accounts/details/${request.target_id}`);
    }
  };

  render() {
    const { history } = this.props;
    return (
      <DataSearch
        Query={RequestsQuery}
        TableComponent={RequestsTable}
        FilterComponent={RequestsFilters}
        history={history}
        onRowClick={this.handleRowClick}
        listenMutations={mutationsToListen}
      />
    );
  }
}

export default Users;
