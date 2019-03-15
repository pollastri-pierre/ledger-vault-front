// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ArrowDown from "./icons/full/ArrowDown";

const styles = _theme => ({
  root: {
    color: "black",
  },
  arrowDownLarge: {
    marginLeft: 10,
    width: 11,
  },
  arrowDownSmall: {
    marginLeft: 10,
    width: 9,
  },
});
// TODO refactor ArrowDown svg to accept the size and update it in all use cases
class BlueSelectRightRenderValue extends Component<*> {
  render() {
    const { classes, children, size } = this.props;
    return (
      <span className={classes.root}>
        {children}
        <ArrowDown
          className={
            size && size === "small"
              ? classes.arrowDownSmall
              : classes.arrowDownLarge
          }
        />
      </span>
    );
  }
}

export default withStyles(styles)(BlueSelectRightRenderValue);
