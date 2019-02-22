// @flow

import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import q from "query-string";

import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import AccountsQuery from "api/queries/AccountsQuery";
import SearchQuery from "api/queries/SearchQuery";
import connectData from "restlay/connectData";

import TryAgain from "components/TryAgain";
import InfiniteScrollable from "components/InfiniteScrollable";
import { OperationsTable } from "components/Table";
import Card, { CardError, CardLoading } from "components/base/Card";
import Box from "components/base/Box";
import { FiltersOperations } from "components/filters";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";

import type { Account, Operation } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  accounts: Account[],
  match: Match,
  history: MemoryHistory
};

type State = {
  query: string
};

class SearchOperations extends PureComponent<Props, State> {
  state = {
    query: location.search
  };

  handleOperationClick = (operation: Operation) => {
    const { history, match } = this.props;
    history.push(`${match.url}/operation/${operation.id}/0`);
  };

  handleChangeQuery = query => {
    this.setState({ query });
    this.props.history.push({
      search: query
    });
  };

  render() {
    const { accounts, match } = this.props;
    const { query } = this.state;
    return (
      <Box horizontal flow={20} align="flex-start">
        <OperationsResult
          query={query}
          accounts={accounts}
          onOperationClick={this.handleOperationClick}
        />
        <FiltersOperations
          accounts={accounts}
          query={query}
          onChange={this.handleChangeQuery}
        />
        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </Box>
    );
  }
}

const OperationsResultComponent = ({
  restlay,
  search,
  accounts,
  onOperationClick
}: {
  restlay: RestlayEnvironment,
  search: Connection<Operation>,
  accounts: Account[],
  onOperationClick: Operation => void
}) => (
  <Card grow>
    <InfiniteScrollable
      restlay={restlay}
      restlayVariable="search"
      chunkSize={20}
    >
      <OperationsTable
        operations={search.edges.map(e => e.node)}
        accounts={accounts}
        onOperationClick={onOperationClick}
        withStatus
        withLabel
      />
    </InfiniteScrollable>
  </Card>
);

const RenderError = ({
  error,
  restlay
}: {
  error: Error,
  restlay: RestlayEnvironment
}) => (
  <Card grow className="search-results">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => <CardLoading grow />;

const OperationsResult = connectData(OperationsResultComponent, {
  queries: {
    search: SearchQuery
  },
  initialVariables: {
    search: 30
  },
  propsToQueryParams: ({ query }) => q.parse(query),
  RenderError,
  RenderLoading
});

export default connectData(withRouter(SearchOperations), {
  RenderError: CardError,
  RenderLoading: CardLoading,
  queries: {
    accounts: AccountsQuery
  }
});
