//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import ValidateBadge from "../icons/full/ValidateBadge";

const styles = {
  base: {
    marginLeft: "8px",
    verticalAlign: "middle"
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
        <span>
          <strong>Confirmed ({nbConfirmations})</strong>
          <ValidateBadge className={classes.base} />
        </span>
      );
    }

    return <span>Unconfirmed</span>;
  }
}

export default withStyles(styles)(ConfirmationStatus);
