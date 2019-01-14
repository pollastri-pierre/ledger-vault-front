// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation } from "data/types";

type Input = void;
export type Response = Operation[];

export default class PendingOperationsQuery extends Query<Input, Response> {
  uri = "/operations/pending";

  responseSchema = [schema.Operation];
}
