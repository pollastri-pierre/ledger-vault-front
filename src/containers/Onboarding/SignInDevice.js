//@flow
import React, { Component } from "react";
import createDevice, { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the sign-in request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

type Challenge = {
  challenge: string,
  key_handle: *
};
type Props = {
  onFinish: Function,
  challenge: Challenge,
  keyHandles: Object
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
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      this.setState({ step: 1 });

      const keyHandle = this.props.keyHandles[pubKey];
      const challenge = this.props.challenge.challenge;
      const instanceName = "";
      const instanceReference = "";
      const instanceURL = "";
      const agentRole = "";

      console.log(challenge, keyHandle);

      const authentication = await device.authenticate(
        Buffer.from(challenge, "base64"),
        APPID_VAULT_ADMINISTRATOR,
        keyHandle,
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );
      this.setState({ step: 2 });
      this.props.onFinish(pubKey, authentication);
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
