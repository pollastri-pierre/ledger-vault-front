// @flow

import { BigNumber } from "bignumber.js";

import type { Transaction } from "data/types";

// flow don't even understand it was not an exact operation.
export function deserializeTransaction(operation: Transaction): Transaction {
  // HACK to not be annoyed by gate changes
  const amount = BigNumber(
    operation.amount ||
      (operation.price ? operation.price.amount || 0 : 0) ||
      0,
  );

  operation = {
    ...operation,
    amount,
    fees: BigNumber(operation.fees),
    gas_limit: BigNumber(operation.gas_limit),
    gas_price: BigNumber(operation.gas_price),
  };
  if (operation.price) {
    operation.price = {
      ...operation.price,
      amount,
    };
  }
  return operation;
}
