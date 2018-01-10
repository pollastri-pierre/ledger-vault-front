//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import ArrowDown from "./icons/full/ArrowDown";

const styles = _theme => ({
  root: {
    color: "black",
  },
  arrowDown: {
    marginLeft: 10,
    width: 11,
  },
});

class BlueSelectRightRenderValue extends Component<*> {
  render() {
    const { classes, children } = this.props;
    return (
      <span className={classes.root}>
        {children}
        <ArrowDown className={classes.arrowDown} />
      </span>
    );
  }
}

export default withStyles(styles)(BlueSelectRightRenderValue);
