//@flow
import React, { PureComponent } from "react";
import CurrencyAccountValue from "../../CurrencyAccountValue";
import CurrencyUnitValue from "../../CurrencyUnitValue";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { countervalueForRate } from "data/currency";
import type { Account } from "data/types";
import { listCurrencies } from "@ledgerhq/currencies";

const allCurrencies = listCurrencies();

const styles = {
  accountItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "normal",
    fontWeight: "normal",
    fontSize: 13,
    height: 64,
    padding: "5px 40px",
    "&:not(:last-child) > :last-child": {
      borderBottom: "solid 1px #eee"
    }
  },
  accountTop: {
    color: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "6px 0"
  },
  accountBottom: {
    color: "#767676",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "6px 0"
  },
  accountName: {},
  accountBalance: {
    fontWeight: 600
  },
  accountCurrency: {
    fontWeight: 600,
    fontSize: 10,
    textTransform: "uppercase"
  },
  accountCountervalue: {}
};

class AccountMenuItem extends PureComponent<{
  selected: boolean,
  account: Account,
  onSelect: Account => void,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  onClick = () => this.props.onSelect(this.props.account);

  render() {
    const { account, selected, classes } = this.props;
    const curr = allCurrencies.find(
      c => c.scheme === account.currency.name
    ) || {
      color: "black"
    };
    const counterValueUnit = countervalueForRate(
      account.currencyRate,
      account.balance
    );
    return (
      <MenuItem
        className={classes.accountItem}
        style={{ color: curr.color }}
        button
        disableRipple
        selected={selected}
        onClick={this.onClick}
        key={account.id}
      >
        <div className={classes.accountTop}>
          <span className={classes.accountName}>{account.name}</span>
          <span className={classes.accountBalance}>
            <CurrencyAccountValue account={account} value={account.balance} />
          </span>
        </div>
        <div className={classes.accountBottom}>
          <span className={classes.accountCurrency}>
            {account.currency.name}
          </span>
          <span className={classes.accountCountervalue}>
            <CurrencyUnitValue {...counterValueUnit} />
          </span>
        </div>
      </MenuItem>
    );
  }
}
export default withStyles(styles)(AccountMenuItem);
