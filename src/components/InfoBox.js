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
  Footer?: *,
  withIcon: boolean,
  children: *,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  container: {
    fontSize: 12,
    flexDirection: "column",
    borderRadius: 3,
    alignItems: "center",
    display: "flex"
  },
  content: {
    padding: 8,
    display: "flex"
  },
  footer: {
    background: "rgba(0,0,0,0.1)",
    display: "flex",
    marginTop: 11,
    justifyContent: "flex-end",
    padding: 5,
    width: "100%"
  },
  icon: {
    marginRight: 10
  },
  isInfo: {
    backgroundColor: hexToRgbA(colors.ocean, 0.2)
  },
  isWarning: {
    backgroundColor: colors.warning
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
      Footer,
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
        <div className={classes.content}>
          {withIcon && this.renderIcon()}
          <div>{children}</div>
        </div>
        {Footer && <div className={classes.footer}>{Footer}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(InfoBox);
