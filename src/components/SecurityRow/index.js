//@flow
import React, { Component } from "react";
import classnames from "classnames";
import colors from "shared/colors";
import { withStyles } from "@material-ui/core/styles";
import ArrowDown from "../icons/full/ArrowDown";

const styles = {
  base: {
    position: "relative",
    outline: "none",
    height: "57px",
    lineHeight: "55px",
    cursor: "pointer",
    "&:not(:last-child)": {
      borderBottom: `1px solid ${colors.argile}`
    }
  },
  disabled: {
    opacity: "0.5",
    cursor: "initial"
  },
  label: {
    fontSize: "13px",
    color: "#000000",
    paddingLeft: "10px",
    display: "inline-block"
  },
  value: {
    fontSize: "13px",
    color: colors.lead,
    marginRight: "20px",
    float: "right"
  },
  arrow: {
    fill: "#000000",
    height: "5px",
    width: "8px",
    marginLeft: "10.5px",
    transform: "rotate(-90deg)",
    position: "absolute",
    right: "0",
    top: "50%",
    marginTop: "-2.5px"
  }
};
class SecurityRow extends Component<{
  icon: React$Node | string,
  label: string,
  disabled?: boolean,
  onClick: Function,
  children: React$Node | string,
  classes: Object
}> {
  render() {
    const { children, icon, label, disabled, onClick, classes } = this.props;
    return (
      <div
        className={classnames(classes.base, { [classes.disabled]: disabled })}
        onClick={disabled ? null : onClick}
      >
        {icon}
        <div className={classes.label}>{label}</div>
        <div className={classes.value}>{children}</div>
        <ArrowDown className={classes.arrow} />
      </div>
    );
  }
}

export default withStyles(styles)(SecurityRow);
