//@flow
import React, { Component } from "react";
import AccountName from "./AccountName";
import type { Account } from "../data/types";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";

const styles = {
  accountOption: {
    display: "flex",
    flexDirection: "row",
    color: "black"
  },
  nameContainer: {
    flex: "1",
    textAlign: "left",
    maxWidth: 150,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginRight: 10
  },
  accountUnit: {}
};

class AccountOption extends Component<{
  account: Account,
  classes: *
}> {
  render() {
    const { account, classes, ...rest } = this.props;
    return (
      <MenuItem style={{ color: account.currency.color }} {...rest}>
        <div className={classes.accountOption}>
          <span className={classes.nameContainer}>
            <AccountName currency={account.currency} name={account.name} />
          </span>
          <span className={classes.accountUnit}>
            {account.currency.units[account.settings.unitIndex].code}
          </span>
        </div>
      </MenuItem>
    );
  }
}

export default withStyles(styles)(AccountOption);
