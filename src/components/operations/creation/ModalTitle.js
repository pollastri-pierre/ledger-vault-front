//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";

const styles = {
  title: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
    margin: 0,
    padding: 40,
    paddingBottom: 20
  }
};

class ModalTitle extends Component<{
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  render() {
    const { children, classes } = this.props;
    return <div className={classes.title}>{children}</div>;
  }
}

export default withStyles(styles)(ModalTitle);
