//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import network from "network";
import createDevice, { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import type { RestlayEnvironment } from "restlay/connectData";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

type State = {
  step: number
};

type Props = {
  account: *,
  close: Function,
  restlay: RestlayEnvironment,
  cancel: Function
};
class DeviceAuthenticate extends Component<Props, State> {
  state = {
    step: 0
  };
  componentDidMount() {
    this.start();
  }

  start = async () => {
    try {
      const device = await await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      this.setState({ step: 1 });
      const instanceName = "";
      const instanceReference = "";
      const instanceURL = "";
      const agentRole = "";
      const application = APPID_VAULT_ADMINISTRATOR;
      const { challenge, key_handle } = await network(
        `/authentications/${pubKey.toUpperCase()}/challenge`,
        "GET"
      );

      const auth = await device.authenticate(
        Buffer.from(challenge, "base64"),
        application,
        Buffer.from(key_handle[pubKey.toUpperCase()], "base64"),
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );

      await network("/authentications/admin/authenticate", "POST", {
        pub_key: pubKey.toUpperCase(),
        authentication: auth.rawResponse
      });

      await this.createAccount();
    } catch (e) {
      console.error(e);
      // this.start();
    }
  };

  createAccount = () => {
    const { account, close, restlay } = this.props;

    const approvers = account.approvers.map(pubKey => {
      return { pub_key: pubKey };
    });

    const securityScheme = Object.assign(
      {
        quorum: account.quorum
      },
      account.time_lock.enabled && {
        time_lock: account.time_lock.value * account.time_lock.frequency
      },
      account.rate_limiter.enabled && {
        rate_limiter: {
          max_transaction: account.rate_limiter.value,
          time_slot: account.rate_limiter.frequency
        }
      }
    );

    const data = {
      name: account.name,
      currency: account.currency.name,
      security_scheme: securityScheme,
      members: approvers
    };

    return restlay
      .commitMutation(new NewAccountMutation(data))
      .then(close)
      .then(() => restlay.fetchQuery(new PendingAccountsQuery()));
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

export default connectData(DeviceAuthenticate);
