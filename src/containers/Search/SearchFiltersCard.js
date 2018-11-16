//@flow
import React, { Component } from "react";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import { DialogButton } from "components";
import ListItemText from "@material-ui/core/ListItemText";

import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Card from "components/Card";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";

import AccountOption from "components/AccountMenuItem";
import AccountName from "components/AccountName";
import AccountMenuItem from "components/AccountMenuItem";
// import DateTimePicker from "material-ui-pickers/DateTimePicker";
import DatePicker, { InlineDatePicker } from "material-ui-pickers/DatePicker";
// import { InlineDateTimePicker } from "material-ui-pickers/DateTimePicker";
import SearchFiltersCardHeader from "./SearchFiltersCardHeader";
import type { Currency, Account } from "data/types";

const allCurrencies = listCryptoCurrencies(true);
const styles = {
  card: {
    position: "relative",
    paddingBottom: 90,
    "& label": {
      display: "block",
      padding: "5px 0",
      "& h3": {
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: 10
      }
    }
  },
  menuItemCurrency: {
    fontWeight: 400,
    fontSize: 13,
    color: "#27d0e2", // FIXME theme
    "& span": {
      color: "black"
    }
  },
  footer: {
    position: "absolute",
    paddingRight: 40,
    width: "100%",
    left: 0,
    bottom: 0
  },
  listItem: {
    fontSize: 12,
    marginLeft: "-15px"
  },
  checkbox: {
    paddingLeft: 0
  }
};

class SearchFiltersCard extends Component<{
  filters: Object,
  onChangeFilters: (filters: Object) => void,
  onClearFilters: () => void,
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
  onDateStartChange = (date: Date) => {
    this.props.onChangeFilters({ dateStart: date });
  };
  onDateEndChange = (date: Date) => {
    this.props.onChangeFilters({ dateEnd: date });
  };
  onStatusChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ status: e.target.value || "" });
  };
  onAccountsChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ accounts: e.target.value || "" });
  };
  onMinAmountChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ minAmount: e.target.value || "" });
  };
  onMaxAmountChange = (e: SyntheticInputEvent<>) => {
    this.props.onChangeFilters({ maxAmount: e.target.value || "" });
  };
  onClearFilters = () => {
    this.props.onClearFilters();
  };
  render() {
    const { accounts, filters, currencies, classes } = this.props;
    return (
      <Card className={classes.card} Header={SearchFiltersCardHeader}>
        <div>
          <label>
            <h3>label</h3>
            <TextField
              placeholder="Operation's label"
              value={filters.keywords}
              fullWidth
              autoFocus
              onChange={this.onKeywordsChange}
            />
          </label>

          <label>
            <h3>date</h3>
            <div
              style={{ width: 100, display: "inline-block", marginRight: 5 }}
            >
              <DatePicker
                clearable
                placeholder="start date"
                value={filters.dateStart}
                onChange={this.onDateStartChange}
                clearLabel="clear"
                rightArrowIcon=">"
                leftArrowIcon="<"
                cancelLabel="cancel"
              />
            </div>
            <div style={{ width: 100, display: "inline-block" }}>
              <DatePicker
                clearable
                value={filters.dateEnd}
                placeholder="end date"
                onChange={this.onDateEndChange}
                clearLabel="clear"
                rightArrowIcon=">"
                leftArrowIcon="<"
                cancelLabel="cancel"
              />
            </div>
          </label>
          <label>
            <h3>Accounts</h3>
            <Select
              value={filters.accounts}
              onChange={this.onAccountsChange}
              multiple
              displayEmpty
              fullWidth
              renderValue={selected =>
                selected
                  .map(
                    accountId =>
                      (accounts.find(a => a.id === accountId) || {}).name || ""
                  )
                  .join(",")}
            >
              {accounts.map(account => (
                <MenuItem
                  key={account.id}
                  value={account.id}
                  disableRipple
                  style={{
                    color:
                      (allCurrencies.find(
                        c => c.id === account.currency.name
                      ) || {}
                      ).color || "black"
                  }}
                >
                  <Checkbox
                    color="primary"
                    checked={filters.accounts.indexOf(account.id) > -1}
                    classes={{ root: classes.checkbox }}
                  />
                  <ListItemText
                    primary={account.name}
                    classes={{ primary: classes.listItem }}
                  />
                </MenuItem>
              ))}
            </Select>
          </label>
          <label>
            <h3>Status</h3>
            <Select
              value={filters.status}
              onChange={this.onStatusChange}
              multiple
              displayEmpty
              fullWidth
              renderValue={selected => selected.join(",")}
            >
              <MenuItem value="PENDING_APPROVAL" disableRipple>
                <Checkbox
                  color="primary"
                  classes={{ root: classes.checkbox }}
                  checked={filters.status.indexOf("PENDING_APPROVAL") > -1}
                />
                <ListItemText
                  primary="PENDING_APPROVAL"
                  classes={{ primary: classes.listItem }}
                />
              </MenuItem>
              <MenuItem value="ABORTED" disableRipple>
                <Checkbox
                  color="primary"
                  classes={{ root: classes.checkbox }}
                  checked={filters.status.indexOf("ABORTED") > -1}
                />
                <ListItemText
                  primary="ABORTED"
                  classes={{ primary: classes.listItem }}
                />
              </MenuItem>
              <MenuItem value="SUBMITTED" disableRipple>
                <Checkbox
                  color="primary"
                  classes={{ root: classes.checkbox }}
                  checked={filters.status.indexOf("SUBMITTED") > -1}
                />
                <ListItemText
                  primary="SUBMITTED"
                  classes={{ primary: classes.listItem }}
                />
              </MenuItem>
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
              <MenuItem
                className={classes.menuItemCurrency}
                disableRipple
                value=""
              >
                <span>All</span>
              </MenuItem>
              {currencies.map(currency => (
                <MenuItem
                  disableRipple
                  key={currency.name}
                  value={currency.name}
                  className={classes.menuItemCurrency}
                >
                  <span>{currency.name}</span>
                </MenuItem>
              ))}
            </Select>
          </label>
          {filters.currencyName !== "" && (
            <label>
              <h3>Amount</h3>
              <TextField
                placeholder="min"
                inputProps={{ style: { width: 80 } }}
                InputProps={{ style: { marginRight: 30 } }}
                autoFocus
                onChange={this.onMinAmountChange}
              />
              <TextField
                placeholder="max"
                inputProps={{ style: { width: 80 } }}
                autoFocus
                onChange={this.onMaxAmountChange}
              />
            </label>
          )}
        </div>
        <div className={classes.footer}>
          <DialogButton right onTouchTap={this.onClearFilters}>
            clear
          </DialogButton>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(SearchFiltersCard);
