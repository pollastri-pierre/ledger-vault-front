//@flow
import React, { Component } from "react";
import StepDeviceGeneric from "./StepDeviceGeneric";
import createDevice, { CONFIDENTIALITY_PATH, KEY_MATERIAL_PATH } from "device";

const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the master seed creation request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

type Channel = {
  pub_key: string,
  certificate: string
};
type Shard = {
  pub_key: string,
  seedShard: string,
  certificate: string
};
type Props = {
  shards_channel: Channel,
  onFinish: Shard => *
};

type State = { step: number };
class GenerateSeed extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 0 };
  }
  componentDidMount() {
    this.start();
  }
  start = async () => {
    try {
      this.setState({ step: 0 });
      const device = await createDevice();

      const pk = await device.getPublicKey(CONFIDENTIALITY_PATH);
      const pub_key = pk["pubKey"];
      const attestation = pk["signature"];

      this.setState({ step: 1 });
      await device.openSession(
        CONFIDENTIALITY_PATH,
        this.props.shards_channel["pub_key"],
        this.props.shards_channel["certificate"]
      );

      const seedShard = await device.generateKeyComponent(KEY_MATERIAL_PATH);
      this.setState({ step: 2 });
      const shard = {
        pub_key,
        seedShard,
        certificate: attestation
      };
      this.props.onFinish(shard);
    } catch (e) {
      console.error(e);
      this.start();
    }
  };
  render() {
    return (
      <StepDeviceGeneric
        steps={steps}
        title="Generate the seed with your device"
        step={this.state.step}
      />
    );
  }
}
export { GenerateSeed };
export default GenerateSeed;
