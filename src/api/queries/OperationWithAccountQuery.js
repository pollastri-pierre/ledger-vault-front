//@flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation, Account } from "data/types";

type Input = {
  operationId: string
};
type Response = {
  operation: Operation,
  account: Account
};

// Fetch a single operation and its associated account
export default class OperationWithAccountQuery extends Query<Input, Response> {
  uri = `/operations/${this.props.operationId}/with-account`;
  responseSchema = {
    operation: schema.Operation,
    account: schema.Account
  };
}
