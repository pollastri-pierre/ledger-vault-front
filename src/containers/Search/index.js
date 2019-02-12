// @flow
import React, { Component } from "react";
import type { Match } from "react-router-dom";
import debounce from "lodash/debounce";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import { listCryptoCurrencies } from "utils/cryptoCurrencies";
import type { Account } from "data/types";
import Box from "components/base/Box";
import SearchFiltersCard from "./SearchFiltersCard";
import SearchResultsCard from "./SearchResultsCard";

type Filters = {
  keywords: ?string,
  accounts: ?Array<string>,
  currencyName: ?string,
  status: ?Array<string>,
  dateEnd: ?Date,
  dateStart: ?Date,
  minAmount: ?string,
  maxAmount: ?string
};

const noFilters = {
  keywords: "",
  accounts: [],
  currencyName: "",
  status: [],
  dateStart: null,
  dateEnd: null,
  minAmount: "",
  maxAmount: ""
};

const currencies = listCryptoCurrencies(true);

type Props = {
  accounts: Account[],
  match: Match
};

type State = {
  filters: Filters,
  debouncedFilters: Filters
};

class Search extends Component<Props, State> {
  state = {
    filters: noFilters,
    debouncedFilters: noFilters
  };

  onChangeFilters = (filtersPatch: $Shape<Filters>) => {
    const filters: Filters = { ...this.state.filters, ...filtersPatch }; // eslint-disable-line react/no-access-state-in-setstate
    this.setState({ filters });
    this.debounceOnChangeFilters(filters);
  };

  onClearFilters = () => {
    this.setState({ filters: noFilters });
    this.debounceOnChangeFilters(noFilters);
  };

  debounceOnChangeFilters = debounce((debouncedFilters: Filters) => {
    this.setState({ debouncedFilters });
  }, 50);

  shouldComponentUpdate(props: *, state: *) {
    return state.filters === state.debouncedFilters;
  }

  render() {
    const { accounts, match } = this.props;
    const { filters, debouncedFilters } = this.state;
    const refreshingKey =
      `${String(debouncedFilters.keywords)} ` +
      `_${String(debouncedFilters.currencyName)}`;

    return (
      <Box grow horizontal align="flex-start" flow={20}>
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
          onClearFilters={this.onClearFilters}
        />
        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </Box>
    );
  }
}

export default connectData(Search, {
  queries: {
    accounts: AccountsQuery
  }
});
