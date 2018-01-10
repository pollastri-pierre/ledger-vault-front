//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import cx from "classnames";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "data/currency";
import type { Account, Rate } from "data/types";

const styles = {
  flat: {
    color: "#767676",
    fontSize: 11,
  },
  crypto: {
    fontSize: 13,
    color: "black",
  },
  strong: {
    fontWeight: 600,
  },
};
class Amount extends Component<{
  account: Account,
  value: number,
  rate?: Rate,
  strong?: boolean,
  classes: { [_: $Keys<typeof styles>]: string },
}> {
  render() {
    const { account, value, rate, strong, classes } = this.props;
    let finalRate = rate;
    if (!rate) {
      finalRate = account.currencyRate;
    }
    let counterValueUnit;
    if (finalRate) {
      counterValueUnit = countervalueForRate(finalRate, value);
    }
    return (
      <span className={cx(classes.crypto, { [classes.strong]: strong })}>
        <CurrencyAccountValue account={account} value={value} />{" "}
        <span className={classes.flat}>
          <CurrencyUnitValue {...counterValueUnit} />
        </span>
      </span>
    );
  }
}

export default withStyles(styles)(Amount);
