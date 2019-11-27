// @flow

import React, { Children, useState } from "react";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import type { Whitelist, Address } from "data/types";
import type { HistoryType } from "components/Address";
import AddressComponent from "components/Address";
import DiffName from "components/DiffName";

type Props = {
  whitelist: Whitelist,
  hideUnchanged: boolean,
};

type AddressRow = {
  history?: HistoryType,
  address: Address,
};

const WhitelistEditRequest = (props: Props) => {
  const { whitelist, hideUnchanged } = props;
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
        added.push({ history: "ADD", address: a });
      } else {
        unchanged.push({ address: a });
      }
    });

    whitelist.addresses.forEach(a => {
      if (!findAddressInList(a, edit_data.addresses)) {
        removed.push({ history: "REMOVE", address: a });
      } else {
        unchanged.push({ address: a });
      }
    });
  }

  const all = [...removed, ...added, ...(hideUnchanged ? [] : unchanged)];
  return (
    <Box>
      <DiffName entity={whitelist} />
      {unchanged.length !== whitelist.addresses.length && (
        <Box flow={15}>
          <Text fontWeight="bold">Addresses</Text>
          <Box flow={10}>
            <Box flow={10}>
              <ShowMore number={8}>
                {all.map(a => (
                  <AddressComponent {...a} />
                ))}
              </ShowMore>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ShowMore = ({
  children,
  number,
}: {
  children: React$Node,
  number: number,
}) => {
  const [showMore, setSetShowMore] = useState(false);
  const childs = Children.toArray(children);

  const showButton = number < childs.length;
  return (
    <>
      {childs.slice(0, showButton ? childs.length : number)}
      {showButton && (
        <Button
          onClick={() => setSetShowMore(!showMore)}
          type="outline"
          variant="primary"
        >
          {showMore ? "show less" : "show more"}
        </Button>
      )}
    </>
  );
};

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
