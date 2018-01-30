//@flow
import React from "react";
import DialogButton from "components/buttons/DialogButton";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { nextStep, previousStep } from "redux/modules/onboarding";

const mapDispatchToProps = dispatch => {
  return {
    onNext: () => dispatch(nextStep()),
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
  onPrev,
  isBack = true,
  render
}: {
  classes: { [$Keys<typeof styles>]: string },
  onNext: Function,
  onPrev: Function,
  isBack: boolean,
  render: Function
}) => {
  return (
    <div className={classes.base}>
      {isBack && <DialogButton onTouchTap={onPrev}>back</DialogButton>}
      <div />
      {render(onPrev, onNext)}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Footer)
);
