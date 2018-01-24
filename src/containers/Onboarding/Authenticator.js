//@flow
import React, { Component } from "react";

import { withStyles } from "material-ui/styles";
import Plug from "components/icons/thin/Plug";
import Hand from "components/icons/thin/Hand";
import { Step } from "components/Onboarding.js";

const styles = {
  base: {
    width: 300,
    margin: "auto",
    textAlign: "center"
  }
};

type Props = {
  classes: { [$keys<typeof styles>]: string }
};

type State = {
  step: number
};

class Authenticator extends Component<Props, State> {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    step: 1
  };
  render() {
    const { classes, step } = this.props;
    const ReversePlug = (
      <Plug
        style={{ width: 32, marginBottom: 1, transform: "rotate(180deg)" }}
        color="#eeeeee"
      />
    );
    return (
      <div className={classes.base}>
        <div>
          {step === 1 && (
            <Plug style={{ width: 32, marginBottom: 1 }} color="#eeeeee" />
          )}
          {step === 2 && <Hand style={{ width: 32, marginBottom: 1 }} />}
          {step === 3 && ReversePlug}
        </div>
        <div>
          <Step label="Connect the authenticator" active={step === 1} />
          <Step label="Press the side button" active={step === 2} />
          <Step label="Disconnect the authenticator" active={step === 3} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Authenticator);
