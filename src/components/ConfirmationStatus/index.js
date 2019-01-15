// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Check from "../icons/Check";
import colors from "../../shared/colors";

const styles = {
  text: {
    marginLeft: "6px"
  },
  isConfirmed: {
    color: colors.green
  },
  isUnconfirmed: {
    color: colors.grenade
  }
};
class ConfirmationStatus extends Component<*> {
  props: {
    nbConfirmations: number,
    classes: Object
  };

  render() {
    const { nbConfirmations, classes } = this.props;

    if (nbConfirmations > 0) {
      return (
        <span className={classes.isConfirmed}>
          <Check color={colors.green} size={11} />
          <span className={classes.text}>Confirmed ({nbConfirmations})</span>
        </span>
      );
    }

    return <span className={classes.isUnconfirmed}>Unconfirmed</span>;
  }
}

export default withStyles(styles)(ConfirmationStatus);
