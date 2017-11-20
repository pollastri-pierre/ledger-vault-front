//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Operation } from "../../data/types";

type Input = {
  accountId: string
};
type Response = Operation[];

export default class AccountOperationsQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/operations`;
  responseSchema = [schema.Operation];
}
