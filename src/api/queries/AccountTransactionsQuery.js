// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { deserializeTransaction } from "api/transformations/Transaction";

type In = {
  accountId: string,
};
type Node = Transaction;

// Fetch transactions of an account
// This API is paginated, refer to ConnectionQuery documentation
export default class AccountTransactionsQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = `/accounts/${this.props.accountId}/transactions`;

  nodeSchema = schema.Transaction;

  deserialize = deserializeTransaction;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
