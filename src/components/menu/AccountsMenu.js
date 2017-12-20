//@flow
import React, { Component } from "react";
import type { Account } from "../../data/types";
import { withStyles } from "material-ui/styles";
import MenuLink from "../MenuLink";
import connectData from "../../restlay/connectData";
import AccountsQuery from "../../api/queries/AccountsQuery";

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
    return accounts.map(account => (
      <MenuLink
        color={account.currency.color}
        key={account.id}
        to={`/account/${account.id}`}
        className={classes.item}
      >
        <span className={classes.name}>{account.name}</span>
        <span className={classes.unit}>{account.currency.units[0].code}</span>
      </MenuLink>
    ));
  }
}

export default connectData(withStyles(styles)(AccountsMenu), {
  queries: {
    accounts: AccountsQuery
  }
});
