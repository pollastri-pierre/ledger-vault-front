// @flow

import { BigNumber } from "bignumber.js";

import type {
  Transaction,
  RawTransactionETH,
  RawTransaction,
  RawTransactionInput,
  RawTransactionOutput,
} from "data/types";

export function deserializeTransaction(transaction: Transaction): Transaction {
  // HACK to not be annoyed by gate changes
  const amount = BigNumber(
    transaction.amount ||
      (transaction.price ? transaction.price.amount || 0 : 0) ||
      0,
  );

  const rawTransaction = deserializeRawTransaction(transaction.transaction);

  transaction = {
    ...transaction,
    ...(rawTransaction ? { transaction: rawTransaction } : {}),
    amount,
    fees: transaction.fees !== null ? BigNumber(transaction.fees) : null,
    max_fees:
      transaction.max_fees !== null ? BigNumber(transaction.max_fees) : null,
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

function deserializeRawTransaction(
  rawTransaction: ?RawTransaction | ?RawTransactionETH,
) {
  if (!rawTransaction) return null;
  if (rawTransaction.inputs) {
    // $FlowFixMe
    return deserializeBTCLikeRawTransaction(rawTransaction);
  }
  if (rawTransaction.gas_price) {
    return deserializeETHLikeRawTransaction(rawTransaction);
  }
  return null;
}

function deserializeETHLikeRawTransaction(r: RawTransactionETH) {
  return {
    ...r,
    gas_price: BigNumber(r.gas_price),
    gas_limit: BigNumber(r.gas_limit),
    value: BigNumber(r.value),
  };
}

function deserializeBTCLikeRawTransaction(r: RawTransaction) {
  return {
    ...r,
    inputs: r.inputs.map(applyBigNumberOnValue),
    outputs: r.outputs.map(applyBigNumberOnValue),
  };
}

function applyBigNumberOnValue(i: RawTransactionInput | RawTransactionOutput) {
  return {
    ...i,
    value: BigNumber(i.value),
  };
}
