// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";

type In = {
  accountId: string,
};
type Node = Transaction;

// Fetch operations of an account
// This API is paginated, refer to ConnectionQuery documentation
export default class AccountTransactionsQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = `/accounts/${this.props.accountId}/transactions`;

  nodeSchema = schema.Transaction;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
