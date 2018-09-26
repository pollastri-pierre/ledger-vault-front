//@flow
import React, { Component } from "react";
import { isAccountOutdated } from "utils/accounts";
import cx from "classnames";
import { getAccountTitle } from "utils/accounts";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import MenuList from "@material-ui/core/MenuList";
import MenuLink from "../MenuLink";

import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
const allCurrencies = listCryptoCurrencies(true);

const styles = {
  item: {
    display: "flex",
    fontWeight: "normal",
    paddingRight: 0
  },
  needUpdate: {
    opacity: "0.4!important"
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
  accounts: Array<Account>,
  match: *
}> {
  render() {
    const { accounts, classes, match } = this.props;
    return (
      <MenuList>
        {accounts.map(account => {
          const curr = allCurrencies.find(
            c => c.scheme === account.currency.name
          ) || {
            color: "black"
          };
          const unit = account.currency.units.reduce(
            (prev, current) =>
              prev.magnitude > current.magnitude ? prev : current
          );
          return (
            <MenuLink
              color={curr.color}
              key={account.id}
              to={`${match.url}/account/${account.id}`}
              className={cx(classes.item, {
                [classes.needUpdate]: isAccountOutdated(account)
              })}
            >
              <span className={classes.name}>{getAccountTitle(account)}</span>
              <span className={classes.unit}>{unit.code}</span>
            </MenuLink>
          );
        })}
      </MenuList>
    );
  }
}

export default withRouter(withStyles(styles)(AccountsMenu));
