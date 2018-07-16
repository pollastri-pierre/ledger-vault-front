//@flow
import React from "react";
// import DialogButton from "components/buttons/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { nextState } from "redux/modules/onboarding";

const mapDispatchToProps = (dispatch: *) => {
  return {
    onNextState: data => dispatch(nextState(data))
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
  onNextState,
  render
}: {
  classes: { [$Keys<typeof styles>]: string },
  onNextState: Function,
  render: Function
}) => {
  return (
    <div className={classes.base}>
      <div />
      {render(onNextState)}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Footer)
);
