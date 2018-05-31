//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import CurrencyAccountValue from "../CurrencyAccountValue";
// import CurrencyUnitValue from "../CurrencyUnitValue";
// import { countervalueForRate } from "data/currency";
import type { Account } from "data/types";
import CounterValue from "components/CounterValue";

const styles = {
  flat: {
    color: "#767676",
    fontSize: 11
  },
  crypto: {
    fontSize: 13,
    marginBottom: 10,
    color: "black"
  },
  strong: {
    fontWeight: 600
  }
};
class Amount extends Component<{
  account: Account,
  value: number,
  strong?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { account, value, strong, classes } = this.props;
    return (
      <span className={cx(classes.crypto, { [classes.strong]: strong })}>
        <CurrencyAccountValue account={account} value={value} />{" "}
        <span className={classes.flat}>
          <CounterValue value={value} from={account.currency.name} />
        </span>
      </span>
    );
  }
}

export default withStyles(styles)(Amount);
