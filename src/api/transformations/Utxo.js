// @flow

import { BigNumber } from "bignumber.js";

import type { UTXO } from "data/types";

export function deserializeUtxo(utxo: UTXO, edge: any): UTXO {
  if (!("amount" in utxo)) {
    console.warn('No "amount" in utxo. Default to 0.');
    utxo.amount = 0;
  }
  if (utxo.amount === null) {
    console.warn("utxo.amount is null. Default to 0.");
    utxo.amount = 0;
  }

  return {
    ...utxo,
    // FIXME GATE SHOULD SEND AN ID
    id: edge.cursor + 1,
    amount: BigNumber(utxo.amount),
  };
}
