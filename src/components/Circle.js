// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  iconContainer: {
    borderRadius: "50%",
    alignItems: "flex-end",
    justifyContent: "center",
    display: "flex",
    alignSelf: "center",
    marginRight: "6px"
  }
};

class Circle extends Component<{
  bg: string,
  size: string,
  classes: Object,
  children: *
}> {
  render() {
    const { bg, size, classes, children } = this.props;
    return (
      <div
        className={classes.iconContainer}
        style={{ backgroundColor: bg, width: size, height: size }}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Circle);
