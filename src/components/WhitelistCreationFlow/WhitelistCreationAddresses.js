// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import Box from "components/base/Box";
import type { Translate, Address } from "data/types";
import AddAddressForm from "components/AddAddressForm";
import type { WhitelistCreationStepProps } from "./types";

type Props = WhitelistCreationStepProps & {
  t: Translate,
};

const WhitelistCreationAddresses = (props: Props) => {
  const { payload, updatePayload } = props;
  const addAddress = addr => {
    const lastItem = payload.addresses[payload.addresses.length - 1];
    const nextId = lastItem ? lastItem.id + 1 : 0;

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
    <Box flow={20}>
      <AddAddressForm
        addresses={payload.addresses}
        onDeleteAddress={removeAddress}
        onAddAddress={addAddress}
        onEditAddress={editAddress}
      />
    </Box>
  );
};

export default withTranslation()(WhitelistCreationAddresses);
