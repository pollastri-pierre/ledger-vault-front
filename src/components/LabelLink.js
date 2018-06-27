//@flow
import React, { Component } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

// this component is wheter active or inactive depending on the route

const styles = {
  base: {
    textTransform: "uppercase",
    fontSize: 11,
    color: "#767676",
    fontWeight: 600,
    paddingLeft: 40,
    display: "block",
    marginBottom: 15
  },
  selected: {
    color: "black"
  }
};

class LabelLink extends Component<{
  className?: string,
  selected: boolean,
  classes: { [_: $Keys<typeof styles>]: string },
  label: string
}> {
  render() {
    const { classes, className, label, selected } = this.props;
    return (
      <span
        className={cx(classes.base, className, {
          [classes.selected]: selected
        })}
      >
        {label}
      </span>
    );
  }
}

export default withStyles(styles)(LabelLink);
