// @flow
import { BigNumber } from "bignumber.js";
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { success, error } from "formatters/notification";
import { deserializeTransaction } from "api/transformations/Transaction";

export type Note = {
  title: string,
  content: string,
};

// FIXME API : The API is not consistent between GET transaction and POST transaction
export const speeds = {
  slow: "slow",
  medium: "normal",
  fast: "fast",
};

export type Speed = $Values<typeof speeds>;

export type TransactionToPOST = {
  amount: BigNumber,
  fee_level: Speed,
  recipient: string,
  note?: Note,
  transaction_id: number,
};

export type Input = {
  transaction: TransactionToPOST,
  accountId: number,
};

type Response = Transaction; // the transaction that has been created

export default class NewTransactionMutation extends Mutation<Input, Response> {
  uri = `/accounts/${this.props.accountId}/transactions`;

  method = "POST";

  responseSchema = schema.Transaction;

  deserialize = deserializeTransaction;

  getSuccessNotification() {
    return success("transaction request", "created");
  }

  getErrorNotification(e: Error) {
    return error("transaction request", "created", e);
  }

  getBody() {
    const { transaction } = this.props;
    return {
      ...transaction,
      amount: transaction.amount.toFixed(),
    };
  }
}
