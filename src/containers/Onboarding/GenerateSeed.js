//@flow
import React, { Component } from "react";
import StepDeviceGeneric from "./StepDeviceGeneric";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import createDevice, {
  CONFIDENTIALITY_PATH,
  KEY_MATERIAL_PATH,
  INIT_SESSION,
  ACCOUNT_MANAGER_SESSION
} from "device";

type Channel = {
  ephemeral_public_key: string,
  ephemeral_certificate: string
};
type Shard = {
  ephemeral_public_key: string,
  blob: string,
  certificate: string
};
type Props = {
  shards_channel: Channel,
  wraps: boolean,
  onFinish: Shard => *,
  t: Translate
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
      const { wraps } = this.props;
      const device = await await createDevice();

      const ephemeral_public_key = this.props.shards_channel[
        "ephemeral_public_key"
      ];
      const certificate = this.props.shards_channel["ephemeral_certificate"];
      const public_key = await device.getPublicKey(CONFIDENTIALITY_PATH);
      const certificate_device = await device.getAttestationCertificate();

      this.setState({ step: 1 });

      let scriptHash = wraps ? INIT_SESSION : ACCOUNT_MANAGER_SESSION;
      await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(certificate, "base64"),
        scriptHash
      );

      const blob = await device.generateKeyComponent(
        KEY_MATERIAL_PATH,
        this.props.wraps
      );

      const shard = {
        blob: blob.toString("hex"),
        certificate:
          certificate_device.toString("hex") +
          public_key["signature"].toString("hex"),
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
    const { t } = this.props;
    const steps = [
      t("onboarding:master_seed_provisionning.device_modal.step1"),
      t("onboarding:master_seed_provisionning.device_modal.step2"),
      t("onboarding:master_seed_provisionning.device_modal.step3")
    ];
    return (
      <StepDeviceGeneric
        steps={steps}
        title={t("onboarding:master_seed_provisionning.device_modal.title")}
        step={this.state.step}
      />
    );
  }
}
export { GenerateSeed };
export default translate()(GenerateSeed);
