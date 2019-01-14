// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";

const styles = {
  bold: {
    fontWeight: 600
  }
};

class Bold extends Component<
  {
    classes: { [_: $Keys<typeof styles>]: string },
    children: *
  },
  *
> {
  render() {
    const { classes, children } = this.props;
    return <span className={classes.bold}>{children}</span>;
  }
}

export default withStyles(styles)(Bold);
