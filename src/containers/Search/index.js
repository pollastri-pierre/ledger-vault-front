//@flow
import React, { Component } from "react";
import debounce from "lodash/debounce";
import SearchResultsCard from "./SearchResultsCard";
import SearchFiltersCard from "./SearchFiltersCard";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import { withStyles } from "@material-ui/core/styles";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import type { Account, Currency } from "data/types";

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

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    "& > :first-child": {
      flex: "1",
      marginRight: "20px"
    },
    "& > :last-child": {
      width: "288px"
    }
  }
};

class Search extends Component<
  {
    accounts: Account[],
    currencies: Currency[],
    classes: Object,
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
    const { accounts, currencies, classes, match } = this.props;
    const { filters, debouncedFilters } = this.state;
    const refreshingKey =
      String(debouncedFilters.keywords) +
      " " +
      "_" +
      String(debouncedFilters.currencyName);
    return (
      <div className={classes.base}>
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
      </div>
    );
  }
}

export default connectData(withStyles(styles)(Search), {
  queries: {
    accounts: AccountsQuery,
    currencies: CurrenciesQuery
  }
});
