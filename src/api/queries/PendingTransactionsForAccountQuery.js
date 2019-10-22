// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";

type In = {
  accountId: number,
};

type Node = Transaction;

export default class PendingTransactionsForAccountQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = `/transactions?status=PENDING&account=${this.props.accountId}`;

  nodeSchema = schema.Transaction;
}
