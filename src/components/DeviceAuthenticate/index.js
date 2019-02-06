// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import network, { NetworkError } from "network";
import { GenericError } from "utils/errors";
import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import createDevice, {
  U2F_PATH,
  APPID_VAULT_ADMINISTRATOR,
  U2F_TIMEOUT
} from "device";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import type { Organization } from "data/types";
import { addMessage, addError } from "redux/modules/alerts";

const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

const mapDispatchToProps = (dispatch: *) => ({
  onAddError: error => dispatch(addError(error)),
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

type State = {
  step: number
};

type Props = {
  organization: Organization,
  onAddError: Error => void,
  onAddMessage: (title: string, content: string, type: string) => void,
  account_id: ?number,
  callback: string => any,
  type: "operations" | "accounts",
  cancel: Function,
  gateAccountType?: string
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
        const { organization, type, account_id, gateAccountType } = this.props;
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        const application = APPID_VAULT_ADMINISTRATOR;
        let url;
        if (type === "operations" && account_id) {
          url = `/accounts/${account_id}/operations/authentications/${pubKey.toUpperCase()}/challenge`;
        } else if (type === "accounts" && account_id) {
          url = `/accounts/${account_id}/authentications/${pubKey.toUpperCase()}/challenge`;
        } else {
          url = `/accounts/authentications/${pubKey.toUpperCase()}/challenge`;
        }

        // Gate now need the account type to be specified in the authenticate
        // step of account creation
        //
        // TODO: use qs package (or similar) to build the query string in a
        // more scalable way
        if (gateAccountType) {
          url += `?account_type=${gateAccountType}`;
        }

        const data = await network(url, "GET");

        const challenge = data.challenge;
        const key_handle = data.key_handle;
        const entity_id =
          type === "accounts" ? data.account_id : data.operation_id;

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

        const urlPost =
          type === "accounts" && account_id
            ? `/${type}/${account_id}/authentications/authenticate`
            : `/${type}/authentications/authenticate`;

        await network(urlPost, "POST", {
          ...(type === "accounts" ? { account_id: entity_id } : {}),
          ...(type === "operations" ? { operation_id: entity_id } : {}),
          pub_key: pubKey.toUpperCase(),
          authentication: auth.rawResponse
        });
        this.props.callback(entity_id);
      } catch (e) {
        console.error(e);
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
          this.props.onAddError(new GenericError());
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
export default connect(
  undefined,
  mapDispatchToProps
)(
  connectData(translate()(DeviceAuthenticate), {
    queries: {
      organization: OrganizationQuery
    }
  })
);
