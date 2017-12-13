//@flow
import React, { PureComponent } from "react";
import type { Currency } from "../../data/types";
import injectSheet from "react-jss";

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
  currency: Currency
}> {
  static defaultProps = {
    size: 6
  };
  render() {
    const { size, currency, classes } = this.props;
    return (
      <span
        className={classes.base}
        style={{ width: size, height: size, background: currency.color }}
      />
    );
  }
}

export default injectSheet(styles)(BadgeCurrency);
