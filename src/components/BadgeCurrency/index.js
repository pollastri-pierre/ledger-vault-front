//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

const styles = {
  base: {
    verticalAlign: "middle",
    marginRight: "6px",
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
    return (
      <span
        className={classnames(classes.base, className)}
        style={{ width: size, height: size, background: currency.color }}
      />
    );
  }
}

export default withStyles(styles)(BadgeCurrency);
