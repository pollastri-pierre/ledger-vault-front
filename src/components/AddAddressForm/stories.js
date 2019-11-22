import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import AddAddressForm from "components/AddAddressForm";
import { generateID } from "utils/idGenerator";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";

import { genAddresses } from "data/mock-entities";

const fakeNetwork = async url => {
  await delay(200);
  if (url.startsWith("/validation")) {
    const [, address] = /.*\/(.*)$/.exec(url);
    // much secure btc-like address verification
    return { is_valid: address.length >= 24 && address.length <= 35 };
  }
};
storiesOf("components/Whitelist", module).add("AddAddressForm", () => {
  return (
    <RestlayProvider network={fakeNetwork}>
      <Wrapper />
    </RestlayProvider>
  );
});

const Wrapper = () => {
  const [addresses, setAddresses] = useState(genAddresses(5));

  const remove = addr => {
    const index = addresses.findIndex(a => a.id === addr.id);
    setAddresses([
      ...addresses.slice(0, index),
      ...addresses.slice(index + 1, addresses.length),
    ]);
  };

  const add = addr => {
    const newId = generateID();
    setAddresses([...addresses, { ...addr, id: newId }]);
  };

  const edit = addr => {
    const newAddresses = addresses.map(a => {
      let newItem;
      if (a.id === addr.id) {
        newItem = { ...addr };
      } else {
        newItem = { ...a };
      }
      return newItem;
    });
    setAddresses(newAddresses);
  };

  return (
    <AddAddressForm
      addresses={addresses}
      onDeleteAddress={remove}
      onAddAddress={add}
      onEditAddress={edit}
    />
  );
};
