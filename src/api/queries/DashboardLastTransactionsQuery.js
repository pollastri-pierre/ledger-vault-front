// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { deserializeTransaction } from "api/transformations/Transaction";

type In = {
  keywords: ?string,
  currencyName: ?string,
  status: ?Array<string>,
  accounts: ?Array<string>,
  dateEnd: ?Date,
  dateStart: ?Date,
  minAmount: ?string,
  maxAmount: ?string,
};

type Node = Transaction;

// returns the N last operations from various accounts (probably not paginated)
export default class DashboardLastTransactionsQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = "/transactions?status=submitted&with_daemon_info=true&batch=5";

  responseSchema = schema.Transaction;

  deserialize = deserializeTransaction;
}
