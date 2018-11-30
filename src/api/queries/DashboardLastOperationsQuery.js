//@flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Operation } from "data/types";

type In = {
  keywords: ?string,
  currencyName: ?string,
  status: ?Array<string>,
  accounts: ?Array<string>,
  dateEnd: ?Date,
  dateStart: ?Date,
  minAmount: ?string,
  maxAmount: ?string
};
type Node = Operation;

// returns the N last operations from various accounts (probably not paginated)
export default class DashboardLastOperationsQuery extends ConnectionQuery<
  In,
  Node
> {
  uri = "/operations?status=submitted&with_daemon_info=true&batch=5";
  responseSchema = schema.Operation;
}
