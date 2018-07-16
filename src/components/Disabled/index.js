//@flow
import React, { Component } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  disabled: {
    opacity: "0.4",
    pointerEvents: "none"
  }
};

class Disabled extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  disabled: boolean,
  children: *
}> {
  render() {
    const { disabled, classes, children } = this.props;
    return (
      <div className={classnames({ [classes.disabled]: disabled })}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Disabled);
