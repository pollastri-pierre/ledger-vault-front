// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import colors from "shared/colors";
import Check from "./icons/Check";

const styles = {
  text: {
    marginLeft: "6px",
  },
  isConfirmed: {
    color: colors.green,
    whiteSpace: "nowrap",
  },
  isUnconfirmed: {
    color: colors.grenade,
    whiteSpace: "nowrap",
  },
};
class ConfirmationStatus extends Component<*> {
  props: {
    nbConfirmations: number,
    threshold: number,
    classes: Object,
  };

  render() {
    const { nbConfirmations, threshold, classes } = this.props;

    if (nbConfirmations > 0) {
      return (
        <span className={classes.isConfirmed}>
          <Check color={colors.green} size={11} />
          <span className={classes.text}>
            Confirmed (
            {nbConfirmations >= threshold ? `${threshold}+` : nbConfirmations})
          </span>
        </span>
      );
    }

    return <span className={classes.isUnconfirmed}>Unconfirmed</span>;
  }
}

export default withStyles(styles)(ConfirmationStatus);
