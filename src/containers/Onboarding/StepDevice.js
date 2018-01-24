//@flow
import React, { Component } from "react";
import { Title, Step, Awaiting } from "../../components/Onboarding";
import { withStyles } from "material-ui/styles";
import Plug from "../../components/icons/thin/Plug.js";
import network from "network";
import DialogButton from "../../components/buttons/DialogButton";
import createDevice, { U2F_PATH } from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";

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

type Props = {
  classes: { [$keys<typeof styles>]: string },
  title: string,
  steps: string[],
  cancel: Function,
  finish: Function,
  challenge: string
};

type State = {
  active: number
};
class StepDevice extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = { active: 0 };
  }
  componentDidMount() {
    // make interval call to see if the blue is connected
    // when the blue is connected, ask it to sign the challenge
    // when signed, POST to API and close the modal

    this.onStart();
  }

  onStart = async () => {
    const device = await createDevice();
    const pubKeyData = await device.fakeGetPublicKey(U2F_PATH);

    this.setState({ active: 1 });
    const { signature } = await this.sign(pubKeyData);
    const { challenge } = await network(
      "/provisioning/administrators/register",
      "POST",
      this.props.data
    );
    this.setState({ active: 2 });
    this.checkUnplugged(pubKeyData, signature);
  };

  sign = pubKey => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ signature: "signature" });
      }, 500);
    });
  };

  checkUnplugged = (pubKey, signature) => {
    setTimeout(() => {
      this.setState({ active: 3 });
      const result = {
        public_key: pubKey,
        challenge_answer: signature
      };
      this.props.finish(result);
    }, 500);
  };
  render() {
    const { classes, title, steps, cancel } = this.props;
    return (
      <StepDeviceGeneric
        step={this.state.active}
        steps={steps}
        title="Register device"
      />
    );
  }
}

export default withStyles(styles)(StepDevice);
