//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
const allCurrencies = listCryptoCurrencies(true);

const styles = {
  base: {
    verticalAlign: "middle",
    marginRight: "10px",
    display: "inline-block",
    borderRadius: "50%"
  }
};
class BadgeCurrency extends PureComponent<{
  size: number,
  classes: { [_: $Keys<typeof styles>]: string },
  currency: CryptoCurrency,
  className?: string
}> {
  static defaultProps = {
    size: 6
  };
  render() {
    const { size, currency, classes, className } = this.props;
    const curr = allCurrencies.find(curr => curr.id === currency.id) || {
      color: "black"
    };
    return (
      <span
        className={classnames(classes.base, className)}
        style={{ width: size, height: size, background: curr.color }}
      />
    );
  }
}

export default withStyles(styles)(BadgeCurrency);
