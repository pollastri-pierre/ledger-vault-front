// @flow

import { BigNumber } from "bignumber.js";

import type { Transaction } from "data/types";

// flow don't even understand it was not an exact transaction.
export function deserializeTransaction(transaction: Transaction): Transaction {
  // HACK to not be annoyed by gate changes
  const amount = BigNumber(
    transaction.amount ||
      (transaction.price ? transaction.price.amount || 0 : 0) ||
      0,
  );

  transaction = {
    ...transaction,
    amount,
    fees: BigNumber(transaction.fees),
    gas_limit: BigNumber(transaction.gas_limit),
    gas_price: BigNumber(transaction.gas_price),
  };
  if (transaction.price) {
    transaction.price = {
      ...transaction.price,
      amount,
    };
  }
  return transaction;
}
