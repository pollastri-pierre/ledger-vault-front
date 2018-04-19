//@flow
import React, { PureComponent } from "react";
import type { Currency } from "data/types";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";
import { listCurrencies } from "@ledgerhq/currencies";

const allCurrencies = listCurrencies();

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
  currency: Currency,
  className?: string
}> {
  static defaultProps = {
    size: 6
  };
  render() {
    const { size, currency, classes, className } = this.props;
    const curr = allCurrencies.find(curr => curr.scheme === currency.name) || {
      color: ""
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
