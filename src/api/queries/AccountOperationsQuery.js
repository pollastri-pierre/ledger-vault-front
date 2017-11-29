//@flow
import ConnectionQuery from "../../restlay/ConnectionQuery";
import schema from "../../data/schema";
import type { Operation } from "../../data/types";

type In = {
  accountId: string
};
type Node = Operation;

// Fetch operations of an account
// This API is paginated, refer to ConnectionQuery documentation
export default class AccountOperationsQuery extends ConnectionQuery<In, Node> {
  uri = `/accounts/${this.props.accountId}/operations`;
  nodeSchema = schema.Operation;
}
