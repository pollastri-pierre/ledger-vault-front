// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import createDevice, {
  CONFIDENTIALITY_PATH,
  U2F_TIMEOUT,
  VALIDATION_PATH,
  MATCHER_SESSION,
  DEVICE_REJECT_ERROR_CODE,
} from "device";
import network from "network";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import FreshAddressesQuery from "api/queries/FreshAddressesQuery";

import QRCode from "components/QRCode";

import type { ReceiveFlowPayload } from "../types";

type FreshAddress = {
  address: string,
  derivation_path: string,
};

type Props = {
  payload: ReceiveFlowPayload,
  fresh_addresses: FreshAddress[],
};
class ReceiveFlowConfirmation extends PureComponent<Props> {
  componentDidMount() {
    // this.verifyAddress();
  }

  verifyAddress = async () => {
    try {
      const device = await createDevice();
      const { payload } = this.props;
      const { selectedAccount } = payload;
      const {
        attestation_certificate,
        ephemeral_public_key,
        wallet_address,
      } = await network(
        `/accounts/${selectedAccount.id}/address?derivation_path=${
          selectedAccount.fresh_addresses[0].derivation_path
        }`,
        "GET",
      );

      await device.openSession(
        CONFIDENTIALITY_PATH,
        Buffer.from(ephemeral_public_key, "hex"),
        Buffer.from(attestation_certificate, "base64"),
        MATCHER_SESSION,
      );
      await device.validateVaultOperation(
        VALIDATION_PATH,
        Buffer.from(wallet_address, "base64"),
      );
      // this.setState({ verified: true, error: null });
    } catch (error) {
      if (error.statusCode && error.statusCode === U2F_TIMEOUT) {
        this.verifyAddress();
      } else if (
        error.statusCode &&
        error.statusCode === DEVICE_REJECT_ERROR_CODE
      ) {
        // this.setState({ deviceRejected: true });
      } else {
        // this.setState({ error, loading: false });
      }
    }
  };

  render() {
    const { payload, fresh_addresses } = this.props;
    const { selectedAccount } = payload;
    const currency = getCryptoCurrencyById(selectedAccount.currency);

    const hash =
      selectedAccount.account_type === "Bitcoin"
        ? `${currency.scheme}:${fresh_addresses[0].address}`
        : `${fresh_addresses[0].address}`;

    return (
      <div>
        <QRCode hash={hash} size={140} />
      </div>
    );
  }
}

export default connectData(ReceiveFlowConfirmation, {
  queries: {
    fresh_addresses: FreshAddressesQuery,
  },
  propsToQueryParams: props => ({
    accountId: props.payload.selectedAccount.id || "",
  }),
});
