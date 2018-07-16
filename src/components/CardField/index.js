//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    display: "inline-block"
  },
  label: {
    color: "#767676",
    fontWeight: "600",
    fontSize: "10px",
    textTransform: "uppercase"
  },
  value: {
    fontSize: "22px",
    paddingBottom: "10px"
  }
};

class CardField extends Component<{
  label: string | React$Node,
  children: string | React$Node,
  align?: string,
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string
}> {
  render() {
    const { label, children, align, classes } = this.props;
    return (
      <div className={classes.base} style={{ textAlign: align }}>
        <div className={classes.value}>{children}</div>
        <div className={classes.label}>{label}</div>
      </div>
    );
  }
}

export default withStyles(styles)(CardField);
