//@flow
import React from "react";
// import DialogButton from "components/buttons/DialogButton";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { nextStep, previousStep, nextState } from "redux/modules/onboarding";

const mapDispatchToProps = dispatch => {
  return {
    onNext: () => dispatch(nextStep()),
    onNextState: data => dispatch(nextState(data)),
    onPrev: () => dispatch(previousStep())
  };
};

const mapStateToProps = state => ({
  step: state.onboarding.currentStep
});

const styles = {
  base: {
    position: "absolute",
    bottom: -40,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  }
};
const Footer = ({
  classes,
  onNext,
  onNextState,
  nextState = false,
  onPrev,
  // isBack = true,
  render
}: {
  classes: { [$Keys<typeof styles>]: string },
  onNext: Function,
  onNextState: Function,
  onPrev: Function,
  isBack: boolean,
  nextState: boolean,
  render: Function
}) => {
  return (
    <div className={classes.base}>
      <div />
      {nextState ? render(onPrev, onNextState) : render(onPrev, onNext)}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Footer)
);
