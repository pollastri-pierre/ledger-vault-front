//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { NetworkError } from "network";
import { translate } from "react-i18next";
import type { Translate } from "data/types";
import network from "network";
import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import createDevice, {
  U2F_PATH,
  APPID_VAULT_ADMINISTRATOR,
  U2F_TIMEOUT
} from "device";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import type { Organization } from "data/types";
import { addMessage } from "redux/modules/alerts";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

const mapDispatchToProps = (dispatch: *) => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

type State = {
  step: number
};

type Props = {
  close: Function,
  organization: Organization,
  t: Translate,
  onAddMessage: (title: string, content: string, type: string) => void,
  callback: Function,
  cancel: Function
};
let _isMounted = false;
class DeviceAuthenticate extends Component<Props, State> {
  state = {
    step: 0
  };
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
        const device = await await createDevice();
        const { organization } = this.props;
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
          Buffer.from(key_handle[pubKey.toUpperCase()], "base64"),
          organization.name,
          organization.workspace,
          organization.domain_name,
          "Administrator"
        );

        this.setState({ step: 1 });

        await network("/authentications/sensitive/authenticate", "POST", {
          pub_key: pubKey.toUpperCase(),
          authentication: auth.rawResponse
        });

        await this.props.callback();
      } catch (e) {
        console.error(e);
        const { t } = this.props;
        if (e instanceof NetworkError) {
          // HSM driver/simu not available
          if (e.json && e.json.code && e.json.code === 500) {
            this.props.onAddMessage(
              t("deviceAuthenticate:errors.hsm_unavailable.title"),
              t("deviceAuthenticate:errors.hsm_unavailable.content"),
              "error"
            );
          }
          this.props.cancel();
        }
        if (e && e.id === U2F_TIMEOUT) {
          this.start();
        } else if (e.statusCode && e.statusCode === 27013) {
          this.props.cancel();
        }
      }
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

export { DeviceAuthenticate };
export default connect(undefined, mapDispatchToProps)(
  connectData(translate()(DeviceAuthenticate), {
    queries: {
      organization: OrganizationQuery
    }
  })
);
