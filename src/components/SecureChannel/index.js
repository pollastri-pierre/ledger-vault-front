//@flow
import React, { Component } from "react";
import DeviceInteraction from "components/DeviceInteraction";
import VaultDeviceApp from "device";
import createDevice, {
  U2F_PATH,
  U2F_TIMEOUT,
  ACCOUNT_MANAGER_SESSION,
  VALIDATION_PATH,
  CONFIDENTIALITY_PATH,
  MATCHER_SESSION
} from "device";

type SecureChannelType = {
  ephemeral_public_key: string,
  attestation_certificate: string,
  data: string
};

type Props = {
  children: *,
  type: "APPROVE_ACCOUNT" | "APPROVE_OPERATION" | "APPROVE_ADDRESS",
  callback: *,
  secureChannel: SecureChannelType
};

export type App = "B0L0S" | "v1+";
export type Response = "deny" | "confirm";

type State = {
  response: ?Response
};

class SecureChannel extends Component<Props, State> {
  state: State = {
    app: null,
    error: false,
    response: null
  };
  _unmounted = false;
  openSession = (device: VaultDeviceApp) => {
    const {
      ephemeral_public_key,
      attestation_certificate
    } = this.props.secureChannel;
    const { type } = this.props;
    if (type === "APPROVE_ADDRESS") {
      return device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(attestation_certificate, "base64"),
        MATCHER_SESSION
      );
    } else {
      return device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(attestation_certificate, "base64"),
        type === "ACCOUNT_APPROVE" ? ACCOUNT_MANAGER_SESSION : MATCHER_SESSION
      );
    }
  };

  validate = (device: VaultDeviceApp) => {
    const { data } = this.props.secureChannel;
    return device.validateVaultOperation(
      VALIDATION_PATH,
      Buffer.from(data, "base64")
    );
  };

  deviceInteration = async () => {
    if (!this._unmounted) {
      try {
        const device = await createDevice();
        await this.openSession(device);
        const signature = await this.validate(device);
        this.props.callback(signature);
      } catch (error) {
        if (error && error.id === U2F_TIMEOUT) {
          this.deviceInteration();
        }
      }
    }
  };

  render() {
    return <DeviceInteraction>{({ app }) => app}</DeviceInteraction>;
  }
}

export default SecureChannel;
