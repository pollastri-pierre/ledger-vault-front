//@flow
import React, { Component } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import MenuList from "@material-ui/core/MenuList";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";

import {
  isAccountOutdated,
  STATUS_UPDATE_IN_PROGRESS,
  getAccountTitle
} from "utils/accounts";

import type { Account } from "data/types";

import CurrencyIndex from "components/CurrencyIndex";
import MenuLink from "../MenuLink";

const styles = {
  item: {
    display: "flex",
    fontWeight: "normal",
    paddingRight: 0
  },
  needUpdate: {
    opacity: "0.2!important"
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

const VISIBLE_STATUS = ["APPROVED", "PENDING_UPDATE"];
class AccountsMenu extends Component<{
  classes: Object,
  accounts: Array<Account>,
  match: *
}> {
  render() {
    const { accounts, classes, match } = this.props;
    return (
      <MenuList>
        {accounts
          .filter(account => VISIBLE_STATUS.indexOf(account.status) > -1)
          .map(account => {
            const curr = getCryptoCurrencyById(account.currency.name);
            const unit = curr.units.reduce(
              (prev, current) =>
                prev.magnitude > current.magnitude ? prev : current
            );
            return (
              <MenuLink
                color={curr.color}
                key={account.id}
                to={`${match.url}/account/${account.id}`}
                className={cx(classes.item, {
                  [classes.needUpdate]:
                    isAccountOutdated(account) ||
                    account.status === STATUS_UPDATE_IN_PROGRESS
                })}
              >
                {isAccountOutdated(account) ? (
                  <span className={classes.name}>
                    <CurrencyIndex
                      index={account.index}
                      currency={account.currency.name}
                    />
                  </span>
                ) : (
                  <div>
                    <span className={classes.name}>
                      {getAccountTitle(account)}
                    </span>
                    <span className={classes.unit}>{unit.code}</span>
                  </div>
                )}
              </MenuLink>
            );
          })}
      </MenuList>
    );
  }
}

export default withRouter(withStyles(styles)(AccountsMenu));
