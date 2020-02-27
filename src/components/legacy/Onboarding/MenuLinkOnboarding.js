// @flow
import React, { Component } from "react";
import styled from "styled-components";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

import colors from "shared/colors";

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

class MenuLinkOnboardingOld extends Component<{
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
          color: color || colors.ocean,
        }}
        button
        disabled={!selected}
        disableRipple
        selected={selected}
        classes={{ root: rootCSS, selected: classes.selected }}
      >
        <span style={{ color: colors.steel }}>{children}</span>
      </MenuItem>
    );
  }
}

type MenuLinkOnboardingType = {
  step: string,
  children: React$Node,
  color: string,
  selected: boolean,
  onGoToStep: () => void,
  heading: boolean,
};
const MenuLink = styled.div`
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  padding-left: 40px;
  opacity: 0.5;
`;

const Span = styled.span`
  color: colors.steel;
`;
const MenuLinkOnboarding = ({
  step,
  children,
  color,
  selected,
  onGoToStep,
  heading,
}: MenuLinkOnboardingType) => {
  return (
    <MenuLink>
      <Span> {children}</Span>
    </MenuLink>
  );
};
// export default MenuLinkOnboarding;
export default withStyles(styles)(MenuLinkOnboardingOld);
