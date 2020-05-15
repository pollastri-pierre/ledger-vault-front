import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import AddAddressForm from "components/AddAddressForm";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Box from "components/base/Box";

import { genAddresses } from "data/mock-entities";

const fakeNetwork = async (url) => {
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
  return (
    <Box width={800}>
      <AddAddressForm addresses={addresses} onChange={setAddresses} />
    </Box>
  );
};
