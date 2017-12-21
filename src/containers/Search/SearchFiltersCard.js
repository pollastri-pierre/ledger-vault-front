//@flow
import React, { Component } from "react";
import TextField from "material-ui/TextField";
import { withStyles } from "material-ui/styles";
import Card from "../../components/Card";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import AccountMenuItem from "../../components/AccountMenuItem";
import SearchFiltersCardHeader from "./SearchFiltersCardHeader";
import type { Currency, Account } from "../../data/types";

const styles = {
  card: {
    "& label": {
      display: "block",
      padding: "20px 0",
      "& h3": {
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: 10,
        color: "#767676" // FIXME theme
      }
    }
  }
};

class SearchFiltersCard extends Component<{
  filters: Object,
  onChangeFilters: (filters: Object) => void,
  currencies: Currency[],
  accounts: Account[],
  classes: Object
}> {
  onKeywordsChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ keywords: e.target.value });
  };
  onAccountChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ accountId: e.target.value || "" });
  };
  onCurrencyChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ currencyName: e.target.value || "" });
  };
  render() {
    const { accounts, filters, currencies, classes } = this.props;
    return (
      <Card className={classes.card} Header={SearchFiltersCardHeader}>
        <div>
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
            <Select
              value={filters.accountId}
              onChange={this.onAccountChange}
              displayEmpty
              fullWidth
              renderValue={id =>
                !id ? "All" : (accounts.find(a => a.id === id) || {}).name
              }
            >
              <MenuItem disableRipple value="">
                All
              </MenuItem>
              {accounts.map(account => (
                <AccountMenuItem
                  disableRipple
                  key={account.id}
                  value={account.id}
                  account={account}
                />
              ))}
            </Select>
          </label>

          <label>
            <h3>currency</h3>
            <Select
              value={filters.currencyName}
              onChange={this.onCurrencyChange}
              displayEmpty
              fullWidth
              renderValue={currencyName => currencyName || "All"}
            >
              <MenuItem disableRipple value="">
                All
              </MenuItem>
              {currencies.map(currency => (
                <MenuItem
                  disableRipple
                  key={currency.name}
                  value={currency.name}
                >
                  {currency.name}
                </MenuItem>
              ))}
            </Select>
          </label>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(SearchFiltersCard);
