//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowDown from "./icons/full/ArrowDown";

const styles = _theme => ({
  root: {
    color: "#27d0e2" // FIXME from theme
  },
  arrowDown: {
    marginRight: 10,
    width: 11,
    fill: "#27d0e2"
  }
});

class BlueSelectRenderValue extends Component<*> {
  render() {
    const { classes, children } = this.props;
    return (
      <span className={classes.root}>
        <ArrowDown className={classes.arrowDown} />
        {children}
      </span>
    );
  }
}

export default withStyles(styles)(BlueSelectRenderValue);
