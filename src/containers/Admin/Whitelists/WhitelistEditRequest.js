// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Whitelist, Address } from "data/types";
import AddressComponent from "components/Address";
import DiffName from "components/DiffName";

type Props = {
  whitelist: Whitelist,
};

class WhitelistEditRequest extends PureComponent<Props> {
  render() {
    const { whitelist } = this.props;
    if (!whitelist.last_request || !whitelist.last_request.edit_data)
      return null;

    return (
      <Box flow={20}>
        <DiffName entity={whitelist} />
        <Box flow={15}>
          <Text fontWeight="bold">Addresses</Text>
          <Box>
            {whitelist.last_request.edit_data.addresses.map(a => {
              const history = findAddressInList(a, whitelist.addresses)
                ? "ADD"
                : undefined;
              return <AddressComponent address={a} history={history} />;
            })}
            {whitelist.addresses.map(a => {
              const history =
                whitelist.last_request &&
                whitelist.last_request.edit_data &&
                findAddressInList(a, whitelist.last_request.edit_data.addresses)
                  ? "REMOVE"
                  : undefined;
              return <AddressComponent address={a} history={history} />;
            })}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default WhitelistEditRequest;

// we can't rely on ID so we have to compare the fields
function findAddressInList(address: Address, addresses: Address[]) {
  return addresses.some(
    a =>
      address.name === a.name &&
      address.address === a.address &&
      address.currency === a.currency,
  );
}
