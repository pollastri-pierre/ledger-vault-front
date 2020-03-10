// @flow

import { BigNumber } from "bignumber.js";

import type { UTXO } from "data/types";

export function deserializeUtxo(utxo: UTXO): UTXO {
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
    id: Math.random(),
    amount: BigNumber(utxo.amount),
  };
}
