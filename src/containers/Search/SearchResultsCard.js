//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import Card from "../../components/Card";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import SearchQuery from "../../api/queries/SearchQuery";
import InfiniteScrollable from "../../components/InfiniteScrollable";
import DataTableOperation from "../../components/DataTableOperation";
import type { Account, Operation } from "../../data/types";
import type { Connection } from "../../restlay/ConnectionQuery";
const columnIds = ["date", "account", "countervalue", "amount"];

class SearchResults extends Component<{
  filters: Object,
  accounts: Account[],
  search: Connection<Operation>,
  restlay: *
}> {
  render() {
    const { restlay, accounts, search } = this.props;
    return (
      <Card
        title={`${(search.edges.length || "no") +
          (search.pageInfo.hasNextPage ? "+" : "")} operation${
          search.edges.length > 1 ? "s" : ""
        } found`}
      >
        <div className="body">
          <InfiniteScrollable
            restlay={restlay}
            restlayVariable="search"
            chunkSize={20}
          >
            <DataTableOperation
              accounts={accounts}
              operations={search.edges.map(e => e.node)}
              columnIds={columnIds}
            />
          </InfiniteScrollable>
        </div>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="search-results">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="search-results">
    <SpinnerCard />
  </Card>
);

export default connectData(SearchResults, {
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
