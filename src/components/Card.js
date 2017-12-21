//@flow
import React, { Component } from "react";
import colors from "../shared/colors";
import { withStyles } from "material-ui/styles";
import common from "../shared/common";
import classnames from "classnames";

const heightSmall = {
  height: "161px"
};

const styles = {
  base: {
    background: "white",
    padding: "40px",
    boxShadow: "0 2.5px 2.5px 0 rgba(0,0,0,.04)",
    position: "relative",
    marginBottom: "20px",
    boxSizing: "border-box",
    "& > header": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > h3": {
        textTransform: "uppercase",
        fontSize: "11px",
        fontWeight: "600",
        color: "black",
        margin: "0 0 20px",
        "& a": {
          ...common.blueLink
        }
      }
    }
  },
  countervalue: {
    ...heightSmall,
    color: colors.lead
  },
  reloading: {
    opacity: 0.5
  }
};

class Card extends Component<*> {
  props: {
    title: string,
    reloading: boolean,
    titleRight: *,
    children: *,
    classes: Object,
    className: string
  };

  render() {
    const {
      title,
      titleRight,
      children,
      classes,
      reloading,
      className
    } = this.props;
    return (
      <div className={classnames(classes.base, className)}>
        <header>
          <h3>{title}</h3>
          {titleRight ? <h3>{titleRight}</h3> : null}
        </header>
        <div className={reloading ? [classes.reloading] : ""}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Card);
