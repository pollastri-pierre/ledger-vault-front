//@flow
import React, { Component } from "react";
import StepDeviceGeneric from "./StepDeviceGeneric";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import createDevice, {
  checkToUpdate,
  CONFIDENTIALITY_PATH,
  KEY_MATERIAL_PATH,
  INIT_SESSION,
  U2F_TIMEOUT,
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
  addMessage: (string, string, string) => void,
  wraps: boolean,
  history: *,
  onFinish: Shard => *,
  t: Translate,
  cancel: Function
};

type State = { step: number };

let _isMounted = false;
class GenerateKeyFragments extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 0 };
  }
  componentDidMount() {
    _isMounted = true;
    this.start();
  }
  componentWillUnmount() {
    _isMounted = false;
  }
  start = async () => {
    if (_isMounted) {
      try {
        this.setState({ step: 0 });
        const { wraps } = this.props;
        const device = await await createDevice();
        const isUpToDate = await checkToUpdate(device, () => {
          this.props.history.push("/update-app");
        });

        if (isUpToDate) {
          const ephemeral_public_key = this.props.shards_channel[
            "ephemeral_public_key"
          ];
          const certificate = this.props.shards_channel[
            "ephemeral_certificate"
          ];
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
        }
      } catch (error) {
        console.error(error);
        //timeout
        if (error.statusCode && error.statusCode === 27013) {
          this.props.cancel();
        } else if (error.statusCode && error.statusCode === 27264) {
          this.props.addMessage(
            "Error",
            "Incorrect data sent to the device",
            "error"
          );
          this.props.cancel();
        } else if (error && error.id === U2F_TIMEOUT) {
          this.start();
        } else {
          this.props.addMessage("Error", "error occured", "error");
          this.props.cancel();
        }
      }
    }
  };
  render() {
    const { t, wraps } = this.props;
    let steps;
    if (wraps) {
      steps = [
        t("onboarding:wrapping_key.device_modal.step1"),
        t("onboarding:wrapping_key.device_modal.step2"),
        t("onboarding:wrapping_key.device_modal.step3")
      ];
    } else {
      steps = [
        t("onboarding:master_seed_provisionning.device_modal.step1"),
        t("onboarding:master_seed_provisionning.device_modal.step2"),
        t("onboarding:master_seed_provisionning.device_modal.step3")
      ];
    }
    return (
      <StepDeviceGeneric
        steps={steps}
        device={this.state.step < 2}
        title={
          wraps
            ? t("onboarding:wrapping_key.device_modal.title")
            : t("onboarding:master_seed_provisionning.device_modal.title")
        }
        step={this.state.step}
        cancel={this.props.cancel}
      />
    );
  }
}
export { GenerateKeyFragments };
export default translate()(GenerateKeyFragments);
