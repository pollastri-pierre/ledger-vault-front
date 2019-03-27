// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Transaction } from "data/types";

type Input = {
  transactionId: string,
};
type Response = {
  transaction: Transaction,
};

// Fetch a single transaction and its associated account
export default class TransactionQuery extends Query<Input, Response> {
  uri = `/transactions/${this.props.transactionId}`;

  responseSchema = {
    transaction: schema.Transaction,
  };
}
