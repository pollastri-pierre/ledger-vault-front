// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import SearchQuery from "api/queries/SearchQuery";
import connectData from "restlay/connectData";

import InfiniteScrollable from "components/InfiniteScrollable";
import { OperationsTable } from "components/Table";
import TryAgain from "components/TryAgain";
import Card, { CardTitle } from "components/base/Card";

import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Account, Operation } from "data/types";

class SearchResults extends Component<{
  accounts: Account[],
  search: Connection<Operation>,
  restlay: RestlayEnvironment,
  match: Match,
  history: MemoryHistory
}> {
  handleOperationClick = (operation: Operation) => {
    const { history, match } = this.props;
    history.push(`${match.url}/operation/${operation.id}/0`);
  };

  render() {
    const { restlay, accounts, search } = this.props;
    const title = `${(search.edges.length || "no") +
      (search.pageInfo.hasNextPage ? "+" : "")} operation${
      search.edges.length > 1 ? "s" : ""
    } found`;

    return (
      <Card grow>
        <CardTitle>{title}</CardTitle>
        <div className="body">
          <InfiniteScrollable
            restlay={restlay}
            restlayVariable="search"
            chunkSize={20}
          >
            <OperationsTable
              operations={search.edges.map(e => e.node)}
              accounts={accounts}
              onOperationClick={this.handleOperationClick}
              withStatus
              withLabel
            />
          </InfiniteScrollable>
        </div>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card grow className="search-results">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card p={40} align="center" grow className="search-results">
    <CircularProgress size={25} />
  </Card>
);

export default connectData(withRouter(SearchResults), {
  queries: {
    search: SearchQuery
  },
  initialVariables: {
    search: 30
  },
  propsToQueryParams: ({ filters }) => filters,
  RenderError,
  RenderLoading
});
