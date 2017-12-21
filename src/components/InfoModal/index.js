//@flow
import React, { PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";

const styles = {
  base: {
    fontSize: "11px",
    color: "black",
    lineHeight: "1.82",
    margin: "0"
  }
};
class InfoModal extends PureComponent<{
  children: React$Node | string,
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
