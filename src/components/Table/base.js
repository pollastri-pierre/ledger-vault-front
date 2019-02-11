// @flow

import React from "react";

import { withStyles } from "@material-ui/core/styles";
import MUITable from "@material-ui/core/Table";
import cx from "classnames";

type Props = {
  className?: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  base: {
    color: "red"
  }
};

const Base = ({ className, classes, ...props }: Props) => (
  <MUITable className={cx(classes.base, className)} {...props} />
);

export default withStyles(styles)(Base);
