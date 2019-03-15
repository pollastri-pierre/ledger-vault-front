// @flow
import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    height: 23,
  },
  head: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    height: 28,
  },
  selected: {
    "&:hover": {
      backgroundColor: "none",
    },
    "& > span": {
      color: "black!important",
    },
  },
  disabled: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    opacity: 0.2,
  },
};

class MenuLinkOnboarding extends Component<{
  step: string,
  classes: Object,
  children: *,
  color: string,
  selected: boolean,
  onGoToStep: Function,
  heading: boolean,
}> {
  triggerView() {
    this.props.onGoToStep(this.props.step);
  }

  render() {
    const { classes, heading, selected, color, children } = this.props;
    const rootCSS = heading ? classes.head : classes.root;
    return (
      <MenuItem
        style={{
          color: color || "#27d0e2", // default FIXME from theme
        }}
        button
        disabled={!selected}
        disableRipple
        selected={selected}
        classes={{ root: rootCSS, selected: classes.selected }}
      >
        <span style={{ color: "#767676" }}>{children}</span>
      </MenuItem>
    );
  }
}

export default withStyles(styles)(MenuLinkOnboarding);
