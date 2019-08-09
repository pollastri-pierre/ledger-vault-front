// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";

import RequestsQuery from "api/queries/RequestsQuery";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";

import RequestsTable from "components/Table/RequestsTable";
import { RequestsFilters } from "components/filters";
import DataSearch from "components/DataSearch";
import { getModalTabLink } from "utils/request";

import type { Request } from "data/types";

type Props = {
  history: MemoryHistory,
};

const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];

class Users extends PureComponent<Props> {
  handleRowClick = (request: Request) => {
    if (request.target_type === "GROUP") {
      this.props.history.push(
        getModalTabLink(
          request,
          `tasks/groups/details/${request.target_id}`,
          true,
        ),
      );
    } else if (request.target_type === "PERSON") {
      this.props.history.push(
        getModalTabLink(
          request,
          `tasks/users/details/${request.target_id}`,
          true,
        ),
      );
    } else if (
      request.target_type === "BITCOIN_ACCOUNT" ||
      request.target_type === "ERC20_ACCOUNT" ||
      request.target_type === "ETHEREUM_ACCOUNT"
    ) {
      this.props.history.push(
        getModalTabLink(
          request,
          `tasks/accounts/details/${request.target_id}`,
          true,
        ),
      );
    } else if (
      request.target_type === "BITCOIN_LIKE_TRANSACTION" ||
      request.target_type === "ETHEREUM_LIKE_TRANSACTION"
    ) {
      this.props.history.push(
        getModalTabLink(
          request,
          `tasks/transactions/details/${request.target_id}`,
          true,
        ),
      );
    } else if (request.target_type === "ORGANIZATION") {
      this.props.history.push(`tasks/organization/details/${request.id}`);
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
