//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = {
  base: {
    fontSize: "13px",
    color: "black",
    lineHeight: "1.82",
    margin: "0"
  }
};
class InfoModal extends PureComponent<{
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string
}> {
  render() {
    const { children, className, classes } = this.props;

    return (
      <div className={classnames(classes.base, className)}>{children}</div>
    );
  }
}

export default withStyles(styles)(InfoModal);
