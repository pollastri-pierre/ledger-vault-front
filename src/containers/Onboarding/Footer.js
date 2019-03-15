// @flow
import React from "react";
// import DialogButton from "components/buttons/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { nextState, previousState } from "redux/modules/onboarding";

const mapDispatchToProps = (dispatch: *) => ({
  onNextState: data => dispatch(nextState(data)),
  onPreviousState: data => dispatch(previousState(data)),
});

const mapStateToProps = state => ({
  step: state.onboarding.currentStep,
});

const styles = {
  base: {
    position: "absolute",
    bottom: -40,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
};
const Footer = ({
  classes,
  onNextState,
  onPreviousState,
  render,
}: {
  classes: { [$Keys<typeof styles>]: string },
  onNextState: Function,
  onPreviousState: Function,
  render: Function,
}) => (
  <div className={classes.base}>{render(onNextState, onPreviousState)}</div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Footer));
