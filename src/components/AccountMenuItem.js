//@flow
import React, { Component } from "react";
import { getAccountTitle } from "utils/accounts";
import type { Account } from "data/types";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  accountOption: {
    display: "flex",
    flexDirection: "row",
    color: "black",
    width: "100%"
  },
  nameContainer: {
    flex: 1,
    textAlign: "left",
    maxWidth: 150,
    fontWeight: 300,
    fontSize: 13,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginRight: 10
  },
  accountUnit: {
    fontWeight: 600,
    fontSize: 10,
    opacity: 0.5
  }
};

class AccountOption extends Component<{
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { account, classes, ...rest } = this.props;
    return (
      <MenuItem
        button
        disableRipple
        style={{ color: account.currency.color }}
        {...rest}
      >
        <div className={classes.accountOption}>
          <span className={classes.nameContainer}>
            {getAccountTitle(account)}
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
