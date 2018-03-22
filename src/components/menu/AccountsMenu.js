//@flow
import React, { Component } from "react";
import type { Account } from "data/types";
import { withStyles } from "material-ui/styles";
import { MenuList } from "material-ui/Menu";
import MenuLink from "../MenuLink";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import CurrenciesQuery from "api/queries/CurrenciesQuery";

import { listCurrencies } from "@ledgerhq/currencies";
const allCurrencies = listCurrencies();

const styles = {
  item: {
    display: "flex",
    fontWeight: "normal",
    paddingRight: 0
  },
  name: {
    flex: 1,
    paddingRight: 10,
    fontSize: 13,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "black"
  },
  unit: {
    fontSize: 10,
    fontWeight: 600,
    color: "black",
    opacity: 0.2
  }
};

class AccountsMenu extends Component<{
  classes: Object,
  accounts: Array<Account>
}> {
  render() {
    const { accounts, classes } = this.props;
    return (
      <MenuList>
        {accounts.map(account => {
          const curr = allCurrencies.find(
            c => c.scheme === account.currency.name
          ) || {
            color: ""
          };
          const unit = account.currency.units.reduce(
            (prev, current) =>
              prev.magnitude > current.magnitude ? prev : current
          );
          return (
            <MenuLink
              color={curr.color}
              key={account.id}
              to={`/account/${account.id}`}
              className={classes.item}
            >
              <span className={classes.name}>{account.name}</span>
              <span className={classes.unit}>{unit.code}</span>
            </MenuLink>
          );
        })}
      </MenuList>
    );
  }
}

export default connectData(withStyles(styles)(AccountsMenu), {
  queries: {
    accounts: AccountsQuery,
    currencies: CurrenciesQuery
  }
});
