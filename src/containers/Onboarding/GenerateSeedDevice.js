//@flow
import React, { Component } from "react";
import StepDeviceGeneric from "./StepDeviceGeneric";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import createDevice, {
  checkToUpdate,
  CONFIDENTIALITY_PATH,
  KEY_MATERIAL_PATH,
  VALIDATION_PATH,
  U2F_PATH,
  INVALID_DATA,
  U2F_TIMEOUT,
  ACCOUNT_MANAGER_SESSION
} from "device";

type Shard = {
  ephemeral_public_key: string,
  blob: string,
  certificate: string
};
type Props = {
  shards_channel: *,
  addMessage: (string, string, string) => void,
  toggleCancelOnDevice: Function,
  wraps: boolean,
  history: *,
  onFinish: Shard => *,
  t: Translate,
  cancel: Function
};

type State = { step: number };

let _isMounted = false;
class GenerateSeedDevice extends Component<Props, State> {
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
        const device = await await createDevice();
        const isUpToDate = await checkToUpdate(device, () => {
          this.props.history.push("/update-app");
        });

        if (isUpToDate) {
          const { pubKey } = await device.getPublicKey(U2F_PATH, false);

          const channel = this.props.shards_channel.find(
            chan => chan.shared_owner_uid === pubKey
          );

          const ephemeral_public_key = channel["ephemeral_public_key"];
          const certificate = channel["attestation_certificate"];
          const partition_blob = channel["partition_blob"];

          this.setState({ step: 1 });

          await device.openSession(
            CONFIDENTIALITY_PATH,
            Buffer.from(ephemeral_public_key, "hex"),
            Buffer.from(certificate, "base64"),
            ACCOUNT_MANAGER_SESSION
          );

          const signature = await device.validateVaultOperation(
            VALIDATION_PATH,
            Buffer.from(partition_blob, "base64")
          );

          const blob = await device.generateKeyComponent(
            KEY_MATERIAL_PATH,
            false
          );

          const shard = {
            blob: blob.toString("base64"),
            signature: signature.toString("hex"),
            pub_key: pubKey
          };
          this.setState({ step: 2 });
          this.props.onFinish(shard);
        }
      } catch (error) {
        console.error(error);
        //timeout
        if (error.statusCode && error.statusCode === 27013) {
          this.props.cancel();
          this.props.toggleCancelOnDevice();
        } else if (error.statusCode && error.statusCode === INVALID_DATA) {
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
    const { t } = this.props;
    const steps = [
      t("onboarding:master_seed_provisionning.device_modal.step1"),
      t("onboarding:master_seed_provisionning.device_modal.step2"),
      t("onboarding:master_seed_provisionning.device_modal.step3")
    ];
    return (
      <StepDeviceGeneric
        steps={steps}
        device={this.state.step < 2}
        title={t("onboarding:master_seed_provisionning.device_modal.title")}
        step={this.state.step}
        cancel={this.props.cancel}
      />
    );
  }
}
export { GenerateSeedDevice };
export default translate()(GenerateSeedDevice);
