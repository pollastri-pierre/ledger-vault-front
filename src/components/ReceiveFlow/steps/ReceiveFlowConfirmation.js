// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import FreshAddressesQuery from "api/queries/FreshAddressesQuery";
import Box from "components/base/Box";
import Card from "components/base/Card";

import QRCode from "components/QRCode";

import type { FreshAddress } from "data/types";
import AddressNotVerified from "../AddressNotVerified";
import AddressVerified from "../AddressVerified";

import type { ReceiveFlowPayload } from "../types";

type Props = {
  payload: ReceiveFlowPayload,
  fresh_addresses: FreshAddress[],
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
};
class ReceiveFlowConfirmation extends PureComponent<Props> {
  render() {
    const { payload, fresh_addresses, updatePayload } = this.props;
    const { selectedAccount } = payload;
    const currency = getCryptoCurrencyById(selectedAccount.currency);

    const hash =
      selectedAccount.account_type === "Bitcoin"
        ? `${currency.scheme}:${fresh_addresses[0].address}`
        : `${fresh_addresses[0].address}`;

    return (
      <Card style={styles.container}>
        <Box p={20} flow={20} align="center" justify="center">
          <QRCode hash={hash} size={140} />
          {payload.isAddressVerified ? (
            <AddressVerified
              fresh_address={fresh_addresses[0]}
              payload={payload}
              updatePayload={updatePayload}
            />
          ) : (
            <AddressNotVerified
              fresh_address={fresh_addresses[0]}
              updatePayload={updatePayload}
              payload={payload}
            />
          )}
        </Box>
      </Card>
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

const styles = {
  container: {
    backgroundColor: "#fdfdfd",
  },
};
