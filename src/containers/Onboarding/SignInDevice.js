//@flow
import React, { Component } from "react";
import createDevice, { U2F_PATH, APPID_VAULT_BOOTSTRAP } from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the sign-in request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

type Challenge = {
  challenge: string,
  handles: string[]
};
type Props = {
  onFinish: Function,
  challenge: Challenge
};

type State = {
  step: number
};

class SignInDevice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 1 };
  }
  componentDidMount() {
    this.start();
  }

  start = async () => {
    this.setState({ step: 0 });
    try {
      const device = await createDevice();
      const pub_key = await device.getPublicKey(U2F_PATH);
      this.setState({ step: 1 });
      const instanceName = "_";
      const instanceReference = "_";
      const instanceURL = "_";
      const agentRole = "_";
      const authentication = await device.authenticate(
        this.props.challenge.challenge,
        APPID_VAULT_BOOTSTRAP,
        this.props.challenge.handles[0],
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );
      this.setState({ step: 2 });
      this.props.onFinish(pub_key, authentication);
    } catch (e) {
      console.error(e);
      // this.start();
    }
  };
  render() {
    return (
      <StepDeviceGeneric
        steps={steps}
        title="Sign-in with your device"
        step={this.state.step}
      />
    );
  }
}
export { SignInDevice };
export default SignInDevice;
