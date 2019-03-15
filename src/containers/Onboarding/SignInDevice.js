// @flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import type { Translate } from "data/types";
import { translate, Trans } from "react-i18next";
import createDevice, {
  U2F_PATH,
  APPID_VAULT_ADMINISTRATOR,
  U2F_TIMEOUT,
} from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";

type Props = {
  onFinish: Function,
  onAddMessage: Function,
  challenge: string,
  organization: *,
  keyHandles: Object,
  cancel: Function,
  t: Translate,
};

type State = {
  step: number,
};

let _isMounted = false;
class SignInDevice extends Component<Props, State> {
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
      const { organization } = this.props;
      try {
        const device = await createDevice();
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        this.setState({ step: 1 });

        const keyHandle = this.props.keyHandles[pubKey.toUpperCase()];
        const challenge = this.props.challenge;

        if (keyHandle) {
          const authentication = await device.authenticate(
            Buffer.from(challenge, "base64"),
            APPID_VAULT_ADMINISTRATOR,
            Buffer.from(keyHandle, "base64"),
            organization.name,
            organization.workspace,
            organization.domain_name,
            "Administrator",
          );
          this.setState({ step: 2 });
          this.props.onFinish(pubKey, authentication);
        } else {
          this.props.onAddMessage(
            "Keyhandle Not found",
            "Are you sure to use a registered device?",
            "error",
          );
          this.props.cancel();
        }
      } catch (e) {
        if (e.statusCode && e.statusCode === 27013) {
          this.props.cancel();
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
      />,
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
export { SignInDevice };
export default connectData(translate()(SignInDevice), {
  queries: {
    organization: OrganizationQuery,
  },
});
