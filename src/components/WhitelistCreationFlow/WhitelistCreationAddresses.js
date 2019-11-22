// @flow
import React from "react";

import type { Address } from "data/types";
import AddAddressForm from "components/AddAddressForm";
import { generateID } from "utils/idGenerator";
import type { WhitelistCreationStepProps } from "./types";

const WhitelistCreationAddresses = (props: WhitelistCreationStepProps) => {
  const { payload, updatePayload } = props;
  const addAddress = addr => {
    const nextId = generateID();

    updatePayload({
      addresses: [{ ...addr, id: nextId }, ...payload.addresses],
    });
  };

  const removeAddress = (address: Address) => {
    const index = payload.addresses.findIndex(a => a.id === address.id);
    if (index > -1) {
      const newAddresses = [
        ...payload.addresses.slice(0, index),
        ...payload.addresses.slice(index + 1, payload.addresses.length),
      ];
      if (newAddresses.length === 0) {
        return updatePayload({ addresses: [] });
      }
      return updatePayload({ addresses: newAddresses });
    }
  };

  const editAddress = addr => {
    const newAddresses = payload.addresses.map(a => {
      let newItem;
      if (a.id === addr.id) {
        newItem = { ...addr };
      } else {
        newItem = { ...a };
      }
      return newItem;
    });
    updatePayload({ addresses: newAddresses });
  };

  return (
    <AddAddressForm
      addresses={payload.addresses}
      onDeleteAddress={removeAddress}
      onAddAddress={addAddress}
      onEditAddress={editAddress}
    />
  );
};

export default WhitelistCreationAddresses;
