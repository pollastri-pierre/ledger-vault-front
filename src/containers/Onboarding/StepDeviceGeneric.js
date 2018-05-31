//@flow
import React from "react";
import { Title, Step, Awaiting } from "../../components/Onboarding";
import { withStyles } from "@material-ui/core/styles";
import Plug from "../../components/icons/thin/Plug.js";
import DialogButton from "../../components/buttons/DialogButton";

const styles = {
  base: { width: 400, padding: "40px 40px 80px 40px" },
  title: { textAlign: "center" },
  step: {
    fontSize: 13,
    paddingLeft: 20,
    position: "relative",
    "&:before": {
      position: "absolute",
      top: 27,
      left: 0
    }
  },
  footer: {
    position: "absolute",
    width: "100%",
    height: 51,
    bottom: 0,
    left: 0,
    display: "flex",
    padding: "0 40px 0 40px",
    justifyContent: "space-between"
  }
};

const StepDeviceGeneric = ({
  classes,
  title,
  steps,
  step,
  cancel
}: {
  classes: { [$Keys<typeof styles>]: string },
  title: string,
  steps: string[],
  step: number,
  cancel: Function,
  finish: Function
}) => {
  return (
    <div className={classes.base}>
      <div className={classes.title}>
        <Plug color="#eeeeee" style={{ height: 28, marginBottom: 10 }} />
        <Title>{title}</Title>
      </div>
      <div>
        {steps.map((step_item, i) => {
          return (
            <Step
              label={step_item}
              active={i === step}
              className={classes.step}
              key={i}
            />
          );
        })}
      </div>
      <div className={classes.footer}>
        <DialogButton onTouchTap={cancel}>Cancel</DialogButton>
        <Awaiting />
      </div>
    </div>
  );
};

export default withStyles(styles)(StepDeviceGeneric);
