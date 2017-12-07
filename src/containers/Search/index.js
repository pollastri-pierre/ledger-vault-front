//@flow
import React, { Component } from "react";
import debounce from "lodash/debounce";
import SearchResultsCard from "./SearchResultsCard";
import SearchFiltersCard from "./SearchFiltersCard";
import connectData from "../../restlay/connectData";
import AccountsQuery from "../../api/queries/AccountsQuery";
import CurrenciesQuery from "../../api/queries/CurrenciesQuery";
import type { Account, Currency } from "../../data/types";

type Filters = {
  keywords: ?string,
  accountId: ?string,
  currencyName: ?string
};

const noFilters = {
  keywords: null,
  accountId: null,
  currencyName: null
};

class Search extends Component<
  {
    accounts: Account[],
    currencies: Currency[],
    match: *,
    location: *,
    history: *
  },
  {
    filters: Filters,
    debouncedFilters: Filters
  }
> {
  state = {
    filters: noFilters,
    debouncedFilters: noFilters
  };

  onChangeFilters = (filtersPatch: $Shape<Filters>) => {
    const filters: Filters = { ...this.state.filters, ...filtersPatch };
    this.setState({ filters });
    this.debounceOnChangeFilters(filters);
  };

  debounceOnChangeFilters = debounce((debouncedFilters: Filters) => {
    this.setState({ debouncedFilters });
  }, 200);

  shouldComponentUpdate(props: *, state: *) {
    return state.filters === state.debouncedFilters;
  }

  render() {
    const { accounts, currencies } = this.props;
    const { filters, debouncedFilters } = this.state;
    // FIXME debounce a bit the filters to send to SearchResultsCard?
    const refreshingKey =
      String(debouncedFilters.keywords) +
      " " +
      String(debouncedFilters.accountId) +
      "_" +
      String(debouncedFilters.currencyName);
    return (
      <div className="container-search">
        <SearchResultsCard
          accounts={accounts}
          filters={debouncedFilters}
          key={refreshingKey}
        />
        <SearchFiltersCard
          accounts={accounts}
          currencies={currencies}
          filters={filters}
          onChangeFilters={this.onChangeFilters}
        />
      </div>
    );
  }
}

export default connectData(Search, {
  queries: {
    accounts: AccountsQuery,
    currencies: CurrenciesQuery
  }
});
