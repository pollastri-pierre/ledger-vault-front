// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {},
  index: { color: "#b7b3b3" },
  currency: {}
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  currency: string,
  index: number
};

class CurrencyIndex extends Component<Props> {
  render() {
    const { currency, index, classes } = this.props;
    return (
      <span className={classes.base}>
        <span className={classes.currency}>{currency}</span>
        <span className={classes.index}> #{index}</span>
      </span>
    );
  }
}

export default withStyles(styles)(CurrencyIndex);
