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
    edit_data.addresses.forEach((a) => {
      if (!findAddressInList(a, whitelist.addresses)) {
        added.push({ address: a });
      } else {
        unchanged.push({ address: a });
      }
    });

    whitelist.addresses.forEach((a) => {
      if (!findAddressInList(a, edit_data.addresses)) {
        removed.push({ address: a });
      } else {
        unchanged.push({ address: a });
      }
    });
  }
  const unchangedWithoutDups = unchanged.filter(
    (w, i, arr) =>
      arr.findIndex(
        (el) =>
          el.address.name === w.address.name &&
          el.address.currency === w.address.currency &&
          el.address.address === w.address.address,
      ) === i,
  );

  const hasAddressesChanged = added.length > 0 || removed.length > 0;

  const iconByType = {
    added: (
      <Box
        align="center"
        justify="center"
        style={{
          borderRadius: "50%",
          width: 20,
          height: 20,
        }}
      >
        <MdAdd size={16} color={colors.green} />
      </Box>
    ),
    removed: (
      <Box
        align="center"
        justify="center"
        style={{
          borderRadius: "50%",
          width: 20,
          height: 20,
        }}
      >
        <MdClose size={16} color={colors.grenade} />
      </Box>
    ),
  };

  return (
    <Box flow={20}>
      <DiffName entity={whitelist} />
      <Box flow={15}>
        {hasAddressesChanged && (
          <>
            <Text fontWeight="bold">Addresses</Text>
            <Box flow={5}>
              {added.length > 0 && (
                <Overlay type="added">
                  {added.map((a) => (
                    <Box
                      flow={10}
                      horizontal
                      align="center"
                      justify="space-between"
                    >
                      {iconByType.added}
                      <AddressComponent address={a.address} customBg="white" />
                    </Box>
                  ))}
                </Overlay>
              )}
              {removed.length > 0 && (
                <Overlay type="removed">
                  {removed.map((a) => (
                    <Box
                      flow={10}
                      horizontal
                      align="center"
                      justify="space-between"
                    >
                      {iconByType.removed}
                      <AddressComponent address={a.address} customBg="white" />
                    </Box>
                  ))}
                </Overlay>
              )}
              {unchangedWithoutDups.length > 0 && (
                <Overlay>
                  {unchangedWithoutDups
                    .slice(0, showMore ? unchangedWithoutDups.length : NB_ITEM)
                    .map((a) => (
                      <Box
                        flow={10}
                        horizontal
                        align="center"
                        justify="space-between"
                      >
                        <AddressComponent
                          address={a.address}
                          customBg="white"
                        />
                      </Box>
                    ))}
                </Overlay>
              )}
            </Box>
            {NB_ITEM < unchangedWithoutDups.length && (
              <Button type="link" onClick={() => setShowMore(!showMore)}>
                {showMore ? "Show less" : "Show more"}
              </Button>
            )}
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
  background: ${(p) =>
    p.type === "added"
      ? `${opacity(colors.green, 0.1)}`
      : p.type === "removed"
      ? `${opacity(colors.grenade, 0.1)}`
      : `${opacity(colors.lightGrey, 0.1)}`};
`;

export default WhitelistEditRequest;

// we can't rely on ID so we have to compare the fields
function findAddressInList(address: Address, addresses: Address[]) {
  return addresses.some(
    (a) =>
      address.name === a.name &&
      address.address === a.address &&
      address.currency === a.currency,
  );
}
