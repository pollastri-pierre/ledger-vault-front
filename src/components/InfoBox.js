// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

import colors, { hexToRgbA } from "shared/colors";

type InfoBoxType = "info" | "warning" | "error";

type Props = {
  className?: string,
  type: InfoBoxType,
  children: *,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  container: {
    fontSize: 12,
    padding: 8,
    borderRadius: 3
  },
  isInfo: {
    backgroundColor: hexToRgbA(colors.ocean, 0.2)
  },
  isWarning: {
    backgroundColor: "orange"
  },
  isError: {
    backgroundColor: "red"
  }
};

class InfoBox extends PureComponent<Props> {
  render() {
    const { children, type, className, classes, ...props } = this.props;
    return (
      <div
        {...props}
        className={cx(
          classes.container,
          type === "info" && classes.isInfo,
          type === "warning" && classes.isWarning,
          type === "error" && classes.isError,
          className
        )}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(InfoBox);
