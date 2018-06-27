//@flow
import React, { Component } from "react";
import network from "network";
import createDevice, { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

type State = {
  step: number
};

type Props = {
  close: Function,
  callback: Function,
  cancel: Function
};
class DeviceAuthenticate extends Component<Props, State> {
  state = {
    step: 0
  };
  componentDidMount() {
    this.start();
  }

  start = async () => {
    try {
      const device = await await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      this.setState({ step: 1 });
      const application = APPID_VAULT_ADMINISTRATOR;
      const { challenge, key_handle } = await network(
        `/authentications/${pubKey.toUpperCase()}/sensitive/challenge`,
        "GET"
      );

      const auth = await device.authenticate(
        Buffer.from(challenge, "base64"),
        application,
        Buffer.from(key_handle[pubKey.toUpperCase()], "base64")
      );

      await network("/authentications/sensitive/authenticate", "POST", {
        pub_key: pubKey.toUpperCase(),
        authentication: auth.rawResponse
      });

      await this.props.callback();
    } catch (e) {
      console.error(e);
      // this.start();
    }
  };

  render() {
    return (
      <div>
        <StepDeviceGeneric
          title="Authenticate with device"
          cancel={this.props.cancel}
          step={this.state.step}
          steps={steps}
        />
      </div>
    );
  }
}

export default DeviceAuthenticate;
