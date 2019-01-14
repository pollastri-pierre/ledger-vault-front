// @flow
import React, { Component } from "react";
import type { Translate } from "data/types";
import { translate, Trans } from "react-i18next";
import createDevice, {
  U2F_PATH,
  VALIDATION_PATH,
  ACCOUNT_MANAGER_SESSION,
  CONFIDENTIALITY_PATH,
  U2F_TIMEOUT
} from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";

type Props = {
  onFinish: Function,
  onAddMessage: Function,
  toggleCancelOnDevice: Function,
  channels: *,
  cancel: Function,
  t: Translate
};

type State = {
  step: number
};

let _isMounted = false;
class SharedOwnerValidationDevice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 1 };
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
      this.setState({ step: 0 });
      try {
        const device = await createDevice();
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        this.setState({ step: 1 });
        const channel = this.props.channels.find(
          chan => chan.admin_uid === pubKey
        );
        if (channel) {
          const ephemeral_public_key = channel.ephemeral_public_key;
          const certificate = channel.attestation_certificate;
          const partition_blob = channel.partition_blob;
          // const certificate_device = await device.getAttestationCertificate();

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

          this.setState({ step: 2 });
          this.props.onFinish(pubKey, signature.toString("hex"));
        } else {
          this.props.cancel();
          this.props.onAddMessage(
            "Error",
            "Please connect an Administrator device",
            "error"
          );
        }
      } catch (e) {
        console.error(e);
        if (e.statusCode && e.statusCode === 27013) {
          this.props.cancel();
          this.props.toggleCancelOnDevice();
        }
        if (e && e.id === U2F_TIMEOUT) {
          this.start();
        }
      }
    }
  };

  render() {
    const { t } = this.props;

    const steps = [
      t("onboarding:master_seed_signin.device_modal.step1"),
      t("onboarding:master_seed_signin.device_modal.step2"),
      <Trans
        key="step3"
        i18nKey="onboarding:master_seed_signin.device_modal.step3"
        components={<b>0</b>}
      />
    ];

    return (
      <StepDeviceGeneric
        steps={steps}
        title={t("onboarding:master_seed_signin.device_modal.title")}
        step={this.state.step}
        device={this.state.step < 2}
        cancel={this.props.cancel}
      />
    );
  }
}
export { SharedOwnerValidationDevice };
export default translate()(SharedOwnerValidationDevice);
