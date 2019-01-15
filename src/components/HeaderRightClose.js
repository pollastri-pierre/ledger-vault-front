// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Close from "components/icons/Close";
import colors from "shared/colors";

const styles = {
  icon: {
    position: "absolute",
    top: 25,
    right: 25,
    cursor: "pointer"
  }
};

class HeaderRightClose extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  close: () => void
}> {
  render() {
    const { classes, close } = this.props;
    return (
      <div className={classes.icon} onClick={close}>
        <Close color={colors.lead} size={14} />
      </div>
    );
  }
}

export default withStyles(styles)(HeaderRightClose);
