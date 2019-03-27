// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { success, error } from "formatters/notification";

export type Note = {
  title: string,
  content: string,
};

// FIXME API : The API is not consistent between GET operation and POST operation
export const speeds = {
  slow: "slow",
  medium: "normal",
  fast: "fast",
};

export type Speed = $Values<typeof speeds>;

export type TransactionToPOST = {
  amount: number,
  fee_level: Speed,
  recipient: string,
  note?: Note,
  transaction_id: number,
};

export type Input = {
  operation: TransactionToPOST,
  accountId: number,
};

type Response = Transaction; // the account that has been created

export default class NewTransactionMutation extends Mutation<Input, Response> {
  uri = `/accounts/${this.props.accountId}/transactions`;

  method = "POST";

  responseSchema = schema.Transaction;

  getSuccessNotification() {
    return success("operation request", "created");
  }

  getErrorNotification(e: Error) {
    return error("operation request", "created", e);
  }

  getBody() {
    return this.props.operation;
  }
}
