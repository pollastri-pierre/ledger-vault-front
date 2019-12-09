// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { MdClose, MdAdd } from "react-icons/md";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import type { Whitelist, Address } from "data/types";
import AddressComponent from "components/Address";
import DiffName from "components/DiffName";
import colors, { opacity } from "shared/colors";

type Props = {
  whitelist: Whitelist,
};

type AddressRow = {
  address: Address,
};

const NB_ITEM = 5;
const WhitelistEditRequest = (props: Props) => {
  const [showMore, setShowMore] = useState(false);
  const { whitelist } = props;
  if (!whitelist.last_request) return null;
  const { last_request } = whitelist;
  if (!last_request.edit_data) return null;
  const { edit_data } = last_request;

  const unchanged: AddressRow[] = [];
  const added: AddressRow[] = [];
  const removed: AddressRow[] = [];

  if (edit_data.addresses) {
    edit_data.addresses.forEach(a => {
      if (!findAddressInList(a, whitelist.addresses)) {
        added.push({ address: a });
      } else {
        unchanged.push({ address: a });
      }
    });

    whitelist.addresses.forEach(a => {
      if (!findAddressInList(a, edit_data.addresses)) {
        removed.push({ address: a });
      } else {
        unchanged.push({ address: a });
      }
    });
  }

  const hasAddressesChanged = added.length > 0 || removed.length > 0;

  return (
    <Box flow={20}>
      <DiffName entity={whitelist} />
      <Box flow={15}>
        {hasAddressesChanged && (
          <>
            <Text fontWeight="bold">Addresses</Text>
            <Box flow={20}>
              <Box flow={10} horizontal align="flex-start">
                {added.length > 0 && (
                  <Overlay type="add">
                    <Box horizontal align="center" flow={5}>
                      <MdAdd size={15} color={colors.green} />
                      <Text>Addresses added</Text>
                    </Box>
                    {added
                      .slice(0, showMore ? added.length : NB_ITEM)
                      .map(a => (
                        <AddressComponent {...a} />
                      ))}
                  </Overlay>
                )}
                {removed.length > 0 && (
                  <Overlay>
                    <Box horizontal align="center" flow={5}>
                      <MdClose size={15} color={colors.grenade} />
                      <Text>Addresses removed</Text>
                    </Box>
                    {removed
                      .slice(0, showMore ? removed.length : NB_ITEM)
                      .map(a => (
                        <AddressComponent {...a} />
                      ))}
                  </Overlay>
                )}
              </Box>
              {(NB_ITEM < added.length || NB_ITEM < removed.length) && (
                <Button type="link" onClick={() => setShowMore(!showMore)}>
                  {showMore ? "Show less" : "Show more"}
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const Overlay = styled(Box).attrs({ flow: 10 })`
  padding: 20px;
  flex: 1;
  border-radius: 4px;
  background: ${p =>
    p.type === "add"
      ? opacity(colors.green, 0.05)
      : opacity(colors.grenade, 0.05)};
`;

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
