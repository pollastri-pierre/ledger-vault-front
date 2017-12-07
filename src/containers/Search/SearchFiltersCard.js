//@flow
import React, { Component } from "react";
import TextField from "material-ui/TextField";
import Card from "../../components/Card";
import { Select, Option } from "../../components/Select";
import AccountOption from "../../components/AccountOption";
import type { Currency, Account } from "../../data/types";

class SearchFiltersCard extends Component<{
  filters: Object,
  onChangeFilters: (filters: Object) => void,
  currencies: Currency[],
  accounts: Account[]
}> {
  onKeywordsChange = (e: SyntheticInputEvent<>) => {
    const keywords = e.target.value;
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
              placeholder="Date, amount, comment,..."
              fullWidth
              autoFocus
              onChange={this.onKeywordsChange}
            />
          </label>

          <label>
            <h3>account</h3>
            <Select theme="black" onChange={this.onAccountChange}>
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
            <Select theme="black" onChange={this.onCurrencyChange}>
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

export default SearchFiltersCard;
