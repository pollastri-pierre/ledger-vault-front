//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import ArrowDown from "../icons/full/ArrowDown";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "data/currency";
import colors from "shared/colors";
import type { Rate, Account } from "data/types";

const styles = {
  base: {
    textAlign: "center"
  },
  amount: {
    color: "black",
    letterSpacing: "-0.9px",
    fontSize: "22px",
    margin: 0,
    marginBottom: 20
  },
  down: {
    fill: "#cccccc",
    width: "16px",
    height: "16px",
    marginBottom: 20
  },
  fiat: {
    fontSize: "11px",
    fontWeight: "600",
    color: colors.steel
  },
  hash: {
    fontSize: "13px",
    margin: "auto",
    marginBottom: "30px",
    width: 290,
    overflowWrap: "break-word"
  }
};
class OverviewOperation extends Component<{
  amount: number,
  hash: string,
  account: Account,
  rate: Rate,
  classes: Object
}> {
  render() {
    const { hash, amount, rate, account, classes } = this.props;
    // const counterValueUnit = countervalueForRate(rate, amount);
    return (
      <div className={classes.base}>
        <div>
          <p className={classes.amount}>
            <CurrencyAccountValue account={account} value={amount} />
          </p>
          {/* <p className={classes.fiat}> */}
          {/*   <CurrencyUnitValue {...counterValueUnit} /> */}
          {/* </p> */}
          <ArrowDown className={classes.down} />
          <p className={classes.hash}>{hash}</p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OverviewOperation);
