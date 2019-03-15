// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    display: "inline-block",
  },
  label: {
    color: "#767676",
    fontWeight: "600",
    fontSize: "10px",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "22px",
    paddingBottom: "10px",
  },
};

class CardField extends Component<{
  label: string | React$Node,
  children: string | React$Node,
  dataTest: ?string,
  align?: string,
  classes: { [_: $Keys<typeof styles>]: string },
}> {
  render() {
    const { label, children, align, classes, dataTest } = this.props;
    return (
      <div
        className={classes.base}
        style={{ textAlign: align }}
        data-test={dataTest}
      >
        <div data-test="value" className={classes.value}>
          {children}
        </div>
        <div data-test="label" className={classes.label}>
          {label}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CardField);
