// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Transaction } from "data/types";

type Input = void;
export type Response = Transaction[];

export default class PendingTransactionsQuery extends Query<Input, Response> {
  uri = "/transactions/pending";

  responseSchema = [schema.Transaction];
}
