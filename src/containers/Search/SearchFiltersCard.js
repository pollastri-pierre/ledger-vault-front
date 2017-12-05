//@flow
import React, { Component } from "react";
import TextField from "material-ui/TextField";
import connectData from "../../restlay/connectData";
import Card from "../../components/Card";
import { Select, Option } from "../../components/Select";
import AccountOption from "../../components/AccountOption";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import AccountsQuery from "../../api/queries/AccountsQuery";
import CurrenciesQuery from "../../api/queries/CurrenciesQuery";
import type { Currency, Account } from "../../data/types";
import "./SearchFiltersCard.css";

class SearchFiltersCard extends Component<{
  filters: Object,
  onChangeFilters: (filters: Object) => void,
  currencies: Currency[],
  accounts: Account[]
}> {
  onKeywordsChange = (e: Event, keywords: string) => {
    this.props.onChangeFilters({ keywords });
  };
  onAccountChange = (accountId: ?string) => {
    this.props.onChangeFilters({ accountId });
  };
  onCurrencyChange = (currencyName: ?string) => {
    this.props.onChangeFilters({ currencyName });
  };
  render() {
    const { accounts, filters, currencies } = this.props;
    return (
      <Card className="search-filters">
        <div className="body">
          <label>
            <h3>keywords</h3>
            <TextField
              id="search-filters-keywords"
              hintText="Date, amount, comment,..."
              fullWidth
              autoFocus
              onChange={this.onKeywordsChange}
            />
          </label>

          <label>
            <h3>account</h3>
            <Select onChange={this.onAccountChange}>
              <Option value={null} selected={filters.accountId === null}>
                All
              </Option>
              {accounts.map(account => (
                <AccountOption
                  key={account.id}
                  account={account}
                  value={account.id}
                  selected={account.id === filters.accountId}
                />
              ))}
            </Select>
          </label>

          <label>
            <h3>currency</h3>
            <Select onChange={this.onCurrencyChange}>
              <Option value={null} selected={filters.currencyName === null}>
                All
              </Option>
              {currencies.map(currency => (
                <Option
                  key={currency.name}
                  value={currency.name}
                  selected={currency.name === filters.currencyName}
                >
                  {currency.name}
                </Option>
              ))}
            </Select>
          </label>
        </div>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="search-filters">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="search-filters">
    <SpinnerCard />
  </Card>
);

export default connectData(SearchFiltersCard, {
  queries: {
    currencies: CurrenciesQuery,
    accounts: AccountsQuery
  },
  RenderError,
  RenderLoading
});
