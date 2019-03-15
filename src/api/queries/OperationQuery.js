// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation } from "data/types";

type Input = {
  operationId: string,
};
type Response = {
  operation: Operation,
};

// Fetch a single operation and its associated account
export default class OperationQuery extends Query<Input, Response> {
  uri = `/operations/${this.props.operationId}`;

  responseSchema = {
    operation: schema.Operation,
  };
}
