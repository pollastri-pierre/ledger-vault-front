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
    // response = post(api, "/hsm/partition/provisioning/start", headers=headers, json=dict(shards_count=3)).json()
    // ephemeral_public_key = unhexlify(response["ephemeral_public_key"])
    // certificate = b64decode(response["ephemeral_certificate"])
    // fragments = []
    // for shard in shards:
    //     fragment = dict()
    //     public_key = shard.get_public_key(shard.CONFIDENTIALITY_PATH, False)
    //     fragment["ephemeral_public_key"] = hexlify(public_key["publicKey"])
    //     fragment["certificate"] = b64encode(public_key["attestation"])
    //     shard.vault_open_session(shard.CONFIDENTIALITY_PATH, ephemeral_public_key, certificate)
    //     fragment["blob"] = b64encode(shard.vault_generate_key_component(shard.KEY_MATERIAL_PATH))
    //     fragments = fragments + [fragment]
    // post(api, "/hsm/partition/provisioning/commit", headers=headers, json=dict(shards=fragments))

    try {
      this.setState({ step: 0 });
      const device = await createDevice();

      const ephemeral_public_key = this.props.shards_channel[
        "ephemeral_public_key"
      ];
      const certificate = this.props.shards_channel["ephemeral_certificate"];
      const public_key = await device.getPublicKey(CONFIDENTIALITY_PATH);

      this.setState({ step: 1 });

      console.log("EPHEMERAL CERTIFICATE");
      console.log(certificate);

      console.log("EPHEMERAL PUBLIC KEY");
      console.log(ephemeral_public_key);

      console.log("CONFIDENTIALITY PATH");
      console.log(CONFIDENTIALITY_PATH);

      const r = await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(certificate, "base64")
      );

      console.log("RESPONSE OPEN SESSION ");
      console.log(r);

      console.log("KEY MATERIAL PATH");
      console.log(KEY_MATERIAL_PATH);

      const blob = await device.generateKeyComponent(KEY_MATERIAL_PATH);
      console.log("RESPONSE BLOB");
      console.log(blob);
      console.log(blob.toString("hex"));

      const shard = {
        blob: blob.toString("hex"),
        certificate: public_key["signature"].toString("hex"),
        ephemeral_public_key: public_key["pubKey"]
      };
      this.setState({ step: 2 });
      this.props.onFinish(shard);
    } catch (e) {
      console.error(e);
      // this.start();
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
