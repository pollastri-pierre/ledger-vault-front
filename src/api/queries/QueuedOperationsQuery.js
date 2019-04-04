// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation } from "data/types";
import { deserializeOperation } from "api/transformations/Operation";

type Input = void;
export type Response = Operation[];

export default class QueuedOperationsQuery extends Query<Input, Response> {
  uri = "/operations/queued";

  responseSchema = [schema.Operation];

  deserialize = deserializeOperation;
}
