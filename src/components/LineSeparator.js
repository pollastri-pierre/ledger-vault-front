/* @flow */

import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import colors from "shared/colors";

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string,
};
const styles = {
  base: {
    borderBottom: `1px solid ${colors.argile}`,
    margin: "5px 0",
  },
};
class LineSeparator extends Component<Props> {
  render() {
    const { classes, className } = this.props;

    return <div className={cx(classes.base, className)} />;
  }
}
export default withStyles(styles)(LineSeparator);
