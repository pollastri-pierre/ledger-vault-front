// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

import Warning from "components/icons/TriangleWarning";
import InfoCircle from "components/icons/InfoCircle";

import colors, { opacity, darken } from "shared/colors";

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
    color: "#555",
    borderRadius: 3
  },
  content: {
    display: "flex"
  },
  inner: {
    padding: 10
  },
  footer: {
    background: "rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "flex-end",
    padding: 5,
    width: "100%"
  },
  icon: {
    flexShrink: 0,
    lineHeight: 0,
    paddingLeft: 10,
    paddingTop: 10,
    display: "flex",
    justifyContent: "center"
  },
  isInfo: {
    backgroundColor: opacity(colors.ocean, 0.05),
    color: darken(colors.ocean, 0.3),
    "& .icon": {
      color: darken(colors.ocean, 0.3)
    },
    "& .footer": {
      background: opacity(colors.ocean, 0.1)
    }
  },
  isWarning: {
    color: darken(colors.blue_orange, 0.5),
    backgroundColor: opacity(colors.blue_orange, 0.1),
    "& .icon": {
      color: darken(colors.blue_orange, 0.5)
    },
    "& .footer": {
      background: opacity(colors.blue_orange, 0.1)
    }
  },
  isError: {
    color: colors.grenade,
    backgroundColor: opacity(colors.grenade, 0.05),
    "& .icon": {
      color: colors.grenade
    },
    "& .footer": {
      background: opacity(colors.grenade, 0.1)
    }
  }
};

class InfoBox extends PureComponent<Props> {
  renderIcon = () => {
    const { type, classes } = this.props;
    let icon;
    if (type === "warning" || type === "error") {
      icon = <Warning width={20} height={20} />;
    } else if (type === "info") {
      icon = <InfoCircle size={20} />;
    }
    if (!icon) return null;
    return <div className={cx("icon", classes.icon)}>{icon}</div>;
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
          <div className={classes.inner}>{children}</div>
        </div>
        {Footer && <div className={cx("footer", classes.footer)}>{Footer}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(InfoBox);
