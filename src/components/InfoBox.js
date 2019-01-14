// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import Warning from "components/icons/TriangleWarning";
import { withStyles } from "@material-ui/core/styles";

import colors, { hexToRgbA } from "shared/colors";

type InfoBoxType = "info" | "warning" | "error";

type Props = {
  className?: string,
  type: InfoBoxType,
  withIcon: boolean,
  children: *,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  container: {
    fontSize: 12,
    padding: 8,
    borderRadius: 3,
    alignItems: "center",
    display: "flex"
  },
  icon: {
    marginRight: 10
  },
  isInfo: {
    backgroundColor: hexToRgbA(colors.ocean, 0.2)
  },
  isWarning: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: colors.grenade
  },
  isError: {
    backgroundColor: "red"
  }
};

class InfoBox extends PureComponent<Props> {
  renderIcon = () => {
    const { type, classes } = this.props;
    let icon;
    if (type === "warning") {
      icon = <Warning width={20} height={20} />;
    }
    return <div className={classes.icon}>{icon}</div>;
  };

  render() {
    const {
      children,
      type,
      withIcon,
      className,
      classes,
      ...props
    } = this.props;
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
        {withIcon && this.renderIcon()}
        <div>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(InfoBox);
