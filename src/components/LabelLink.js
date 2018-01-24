//@flow
import React, { Component } from "react";
import cx from "classnames";
import { withStyles } from "material-ui/styles";

// this component is wheter active or inactive depending on the route

const styles = {
  base: {
    textTransform: "uppercase",
    fontSize: 11,
    color: "#767676",
    fontWeight: 600,
    paddingLeft: 40,
    display: "block",
    marginBottom: 5
  },
  selected: {
    color: "black"
  }
};

class LabelLink extends Component<{
  to: string,
  className?: string,
  selected: boolean,
  classes: { [_: $Keys<typeof styles>]: string },
  label: string
}> {
  render() {
    const { classes, to, className, label, selected } = this.props;
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
