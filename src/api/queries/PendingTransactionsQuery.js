// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";

type In = {
  label?: string,
  currency?: string,
  status?: string[],
  accounts?: string[],
  start?: string,
  end?: string,
};

type Node = Transaction;

export default class PendingTransactionsQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = "/transactions?status=PENDING";

  nodeSchema = schema.Transaction;
}
