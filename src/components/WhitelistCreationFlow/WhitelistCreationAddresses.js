// @flow

import React, { useCallback } from "react";

import AddAddressForm from "components/AddAddressForm";
import type { WhitelistCreationStepProps } from "./types";

const WhitelistCreationAddresses = (props: WhitelistCreationStepProps) => {
  const { payload, updatePayload } = props;
  const onChange = useCallback(addresses => updatePayload({ addresses }), [
    updatePayload,
  ]);
  return <AddAddressForm addresses={payload.addresses} onChange={onChange} />;
};

export default WhitelistCreationAddresses;
