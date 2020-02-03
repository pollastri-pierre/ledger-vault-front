// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { deserializeTransaction } from "api/transformations/Transaction";

type Input = {
  transactionId: string,
};

type Response = Transaction;

export default class TransactionQuery extends Query<Input, Response> {
  uri = `/transactions/${this.props.transactionId}`;

  responseSchema = schema.Transaction;

  deserialize = deserializeTransaction;
}
