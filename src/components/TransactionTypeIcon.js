// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import Circle from "./Circle";
import Receive from "./icons/Receive";
import Send from "./icons/Send";

const styles = {
  iconPosition: {
    justifyContent: "center",
  },
};

class OpTypeIcon extends Component<{ isReceive: boolean, classes: Object }> {
  render() {
    const { isReceive, classes } = this.props;
    return (
      <Circle
        bg={isReceive ? colors.translucentGreen : colors.translucentGrey}
        size="24px"
      >
        <div className={classes.iconPosition}>
          {isReceive ? (
            <Receive size={12} color={colors.green} />
          ) : (
            <Send size={12} color={colors.shark} />
          )}
        </div>
      </Circle>
    );
  }
}

export default withStyles(styles)(OpTypeIcon);
