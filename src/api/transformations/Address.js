// @flow

import type { AddressDaemon } from "data/types";

// temporary transofmer because the gate made a mistaake in the field name
//
type BadAddressDaemon = {
  address: string,
  amount?: string, // <- lol
  derivation_path?: string, // <- lol
};

export function deserializeAddress(addr: BadAddressDaemon): AddressDaemon {
  if (!addr.amount && !addr.derivation_path) {
    throw new Error("no derivation path returned!");
  }
  return {
    address: addr.address,
    // $FlowFixMe
    derivation_path: addr.amount || addr.derivation_path,
  };
}
