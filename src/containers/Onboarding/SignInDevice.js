//@flow
import React, { Component } from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import createDevice, { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";

type Props = {
  onFinish: Function,
  challenge: string,
  keyHandles: Object,
  cancel: Function,
  t: Translate
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

      const keyHandle = this.props.keyHandles[pubKey.toUpperCase()];
      const challenge = this.props.challenge;

      const authentication = await device.authenticate(
        Buffer.from(challenge, "base64"),
        APPID_VAULT_ADMINISTRATOR,
        Buffer.from(keyHandle, "base64")
      );
      this.setState({ step: 2 });
      this.props.onFinish(pubKey, authentication);
    } catch (e) {
      console.error(e);
      // this.start();
    }
  };
  render() {
    const { t } = this.props;

    const steps = [
      t("onboarding:master_seed_signin.device_modal.step1"),
      t("onboarding:master_seed_signin.device_modal.step2"),
      t("onboarding:master_seed_signin.device_modal.step3")
    ];

    return (
      <StepDeviceGeneric
        steps={steps}
        title={t("onboarding:master_seed_signin.device_modal.title")}
        step={this.state.step}
        cancel={this.props.cancel}
      />
    );
  }
}
export { SignInDevice };
export default translate()(SignInDevice);
