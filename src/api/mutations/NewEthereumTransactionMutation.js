// @flow

import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { success, error } from "formatters/notification";

import type { Note } from "./NewTransactionMutation";

export type TransactionToPOST = {
  amount: number,
  recipient: string,
  gas_price: number,
  gas_limit: number,
  note?: Note,
  transaction_id: number,
};

export type Input = {
  operation: TransactionToPOST,
  accountId: number,
};

type Response = Transaction;

export default class NewEthereumTransactionMutation extends Mutation<
  Input,
  Response,
> {
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
