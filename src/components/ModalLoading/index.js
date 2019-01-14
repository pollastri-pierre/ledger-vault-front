// @flow
import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import SpinnerCard from "../spinners/SpinnerCard";

const styles = {
  base: {
    background: "white",
    width: "440px",
    height: "615px"
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string
};

class ModalLoading extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;
    return (
      <div className={cx(classes.base, className)}>
        <SpinnerCard />
      </div>
    );
  }
}

export default withStyles(styles)(ModalLoading);
