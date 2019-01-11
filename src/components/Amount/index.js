//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import CurrencyAccountValue from "../CurrencyAccountValue";
import type { Account } from "data/types";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";

const styles = {
  flat: {
    color: colors.steel,
    fontSize: 11
  },
  crypto: {
    fontSize: 13,
    marginBottom: 10,
    color: colors.black
  },
  strong: {
    fontWeight: 600
  }
};
class Amount extends Component<{
  account: Account,
  value: number,
  dataTest: ?string,
  strong?: boolean,
  erc20Format?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const {
      account,
      value,
      strong,
      classes,
      dataTest,
      erc20Format
    } = this.props;
    const disableCountervalue = erc20Format ? true : false;
    return (
      <span
        className={cx(classes.crypto, { [classes.strong]: strong })}
        data-test={dataTest}
      >
        <CurrencyAccountValue
          account={account}
          value={value}
          erc20Format={erc20Format}
        />{" "}
        <span className={classes.flat}>
          (<CounterValue
            value={value}
            from={account.currency_id}
            disableCountervalue={disableCountervalue}
          />)
        </span>
      </span>
    );
  }
}

export default withStyles(styles)(Amount);
