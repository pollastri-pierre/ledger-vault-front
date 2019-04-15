// @flow

import React from "react";

import Box from "components/base/Box";
import QRCode from "components/QRCode";

import colors from "shared/colors";
import type { Account } from "data/types";

import AddressNotVerified from "./ope-AddressNotVerified";
import AddressVerified from "./ope-AddressVerified";

type Props = {
  fresh_address: Object,
  updateState: ($Shape<*>) => void,
  verifificationInProgress: boolean,
  selectedAccount: Account,
  verified: boolean,
};

export default (props: Props) => {
  const {
    fresh_address,
    updateState,
    verifificationInProgress,
    selectedAccount,
    verified,
  } = props;
  return (
    <Box m={15} bg={colors.cream} style={{ height: 350 }}>
      <Box p={20} flow={20} align="center" justify="center">
        <QRCode hash={fresh_address.address} size={140} />
        {verified ? (
          <AddressVerified
            fresh_address={fresh_address}
            updateState={updateState}
          />
        ) : (
          <AddressNotVerified
            fresh_address={fresh_address}
            updateState={updateState}
            verifificationInProgress={verifificationInProgress}
            selectedAccount={selectedAccount}
          />
        )}
      </Box>
    </Box>
  );
};
