//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  title: {
    padding: "0 40px",
    marginTop: 0,
    marginBottom: 20,
    fontSize: 11,
    fontWeight: 600,
    color: "black",
    textTransform: "uppercase"
  }
};

class ModalSubTitle extends Component<{
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string },
  noPadding: boolean,
  noMargin: boolean
}> {
  render() {
    const { children, classes, noPadding, noMargin } = this.props;
    const style = {};
    if (noPadding) {
      Object.assign(style, { padding: 0 });
    }
    if (noMargin) {
      Object.assign(style, { margin: 0 });
    }
    return (
      <h2 className={classes.title} style={style}>
        {children}
      </h2>
    );
  }
}

export default withStyles(styles)(ModalSubTitle);
