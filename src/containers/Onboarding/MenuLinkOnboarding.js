//@flow
import React, { Component } from "react";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { goToStep } from "redux/modules/onboarding.js";

const mapStateToProps = state => ({
  onboarding: state.onboarding
});

const mapDispatchToProps = dispatch => ({
  onGoToStep: s => dispatch(goToStep(s))
});

const styles = {
  root: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    height: 23
  },
  head: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    height: 28
  },
  selected: {
    "& > span": {
      color: "black!important"
    }
  },
  disabled: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40,
    opacity: 0.2
  }
};

class MenuLinkOnboarding extends Component<{
  step: string,
  classes: Object,
  className?: string,
  children: *,
  overrides?: Object,
  onboarding: Object,
  allowed: boolean,
  onGoToStep: Function,
  heading: boolean
}> {
  triggerView() {
    this.props.onGoToStep(this.props.step);
  }
  render() {
    const {
      classes,
      heading,
      step,
      children,
      onboarding,
      allowed
    } = this.props;
    const rootCSS = heading ? classes.head : classes.root;
    return (
      <MenuItem
        style={{
          color: "#27d0e2" //default FIXME from theme
        }}
        button
        disabled={!allowed}
        disableRipple
        selected={onboarding.currentStep === step}
        classes={{ root: rootCSS, selected: classes.selected }}
        onClick={this.triggerView.bind(this)}
      >
        <span style={{ color: "#767676" }}>{children}</span>
      </MenuItem>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MenuLinkOnboarding)
);
