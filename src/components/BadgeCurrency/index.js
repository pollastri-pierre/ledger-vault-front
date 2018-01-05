//@flow
import React, { PureComponent } from "react";
import type { Currency } from "../../data/types";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

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
  currency: Currency
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
