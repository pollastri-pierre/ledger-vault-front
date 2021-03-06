//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";

const styles = {
  title: {
    padding: "0 40px",
    marginBottom: 20,
    fontSize: 12,
    fontWeight: 600,
    color: "black",
    textTransform: "uppercase"
  }
};

class ModalSubTitle extends Component<{
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string },
  noPadding: boolean
}> {
  render() {
    const { children, classes, noPadding } = this.props;
    const style = noPadding ? { padding: 0 } : null;
    return (
      <h2 className={classes.title} style={style}>
        {children}
      </h2>
    );
  }
}

export default withStyles(styles)(ModalSubTitle);
