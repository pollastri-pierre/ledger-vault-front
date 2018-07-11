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
  account_id: ?number,
  callback: Function,
  type: "operations" | "accounts",
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
        const { organization, type, account_id } = this.props;
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        const application = APPID_VAULT_ADMINISTRATOR;
        const url =
          type === "operations" && account_id
            ? `/accounts/${account_id}/operations/authentications/${pubKey.toUpperCase()}/challenge`
            : `/accounts/authentications/${pubKey.toUpperCase()}/challenge`;
        const data = await network(url, "GET");

        let challenge, key_handle, entity_id;
        challenge = data["challenge"];
        key_handle = data["key_handle"];
        entity_id =
          type === "accounts" ? data["account_id"] : data["operation_id"];

        this.setState({ step: 1 });

        const auth = await device.authenticate(
          Buffer.from(challenge, "base64"),
          application,
          Buffer.from(key_handle[pubKey.toUpperCase()], "base64"),
          organization.name,
          organization.workspace,
          organization.domain_name,
          "Administrator"
        );

        this.setState({ step: 2 });

        // $FlowFixMe
        await network(`/${type}/authentications/authenticate`, "POST", {
          ...(type === "accounts" && { account_id: entity_id }),
          ...(type === "operations" && { operation_id: entity_id }),
          pub_key: pubKey.toUpperCase(),
          authentication: auth.rawResponse
        });

        await this.props.callback(entity_id);
      } catch (e) {
        console.error(e);
        const { t } = this.props;
        if (e instanceof NetworkError && e.json) {
          this.props.onAddMessage(
            `Error ${e.json.code}`,
            e.json.message,
            "error"
          );
          this.props.cancel();
        } else if (e && e.id === U2F_TIMEOUT) {
          this.start();
        } else if (e.statusCode && e.statusCode === 27013) {
          this.props.cancel();
        } else {
          this.props.cancel();
          this.props.onAddMessage(
            t("deviceAuthenticate:errors.unknown.title"),
            t("deviceAuthenticate:errors.unknown.content"),
            "error"
          );
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
          device={this.state.step < 2}
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
