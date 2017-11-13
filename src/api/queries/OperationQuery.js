//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Operation } from "../../data/types";

type Input = {
  operationId: string
};
type Response = Operation;

export default class OperationQuery extends Query<Input, Response> {
  uri = `/operations/${this.props.operationId}`;
  responseSchema = schema.Operation;
}
