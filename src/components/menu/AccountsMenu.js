//@flow
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import type { Account } from "../../data/types";
import connectData from "../../restlay/connectData";
import injectSheet from "react-jss";
import { mixinHoverSelected } from "../../../src/shared/common";
import AccountsQuery from "../../api/queries/AccountsQuery";

const styles = {
  base: {
    fontSize: "13px",
    color: "black",
    "& li": {
      height: "26px",
      margin: "0",
      lineHeight: "26px",
      "& a": {
        ...mixinHoverSelected("currentColor", "0px"),
        textTransform: "none",
        fontWeight: "400"
      }
    },
    "& span": {
      color: "black"
    }
  },
  unit: {
    float: "right",
    fontSize: "10px",
    fontWweight: "600",
    color: "rgba(0,0,0,.2)"
  }
};

class AccountsMenu extends Component<{ accounts: Array<Account> }> {
  render() {
    const { accounts, classes } = this.props;
    return (
      <ul className={classes.base}>
        {accounts.map(account => (
          <li key={account.id}>
            <NavLink
              style={{ color: account.currency.color }}
              to={`/account/${account.id}`}
            >
              <span>{account.name}</span>
              <span className={classes.unit}>
                {account.currency.units[0].code}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }
}

export default connectData(injectSheet(styles)(AccountsMenu), {
  queries: {
    accounts: AccountsQuery
  }
});
