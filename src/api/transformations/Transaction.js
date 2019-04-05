// @flow

import { BigNumber } from "bignumber.js";

import type { Transaction } from "data/types";

// flow don't even understand it was not an exact operation.
export function deserializeTransaction(operation: Transaction): Transaction {
  operation = {
    ...operation,
    amount: BigNumber(operation.amount),
    fees: BigNumber(operation.fees),
    gas_limit: BigNumber(operation.gas_limit),
    gas_price: BigNumber(operation.gas_price),
  };
  if (operation.price) {
    operation.price = {
      ...operation.price,
      amount: BigNumber(operation.price.amount),
    };
  }
  return operation;
}
