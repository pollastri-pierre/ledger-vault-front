// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import type { Account } from "data/types";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import CurrencyAccountValue from "../CurrencyAccountValue";

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

type Props = {
  account: Account,
  value: number,
  dataTest: ?string,
  strong?: boolean,
  erc20Format?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
};

class Amount extends Component<Props> {
  render() {
    const {
      account,
      value,
      strong,
      classes,
      dataTest,
      erc20Format
    } = this.props;
    const disableCountervalue = !!erc20Format;
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
