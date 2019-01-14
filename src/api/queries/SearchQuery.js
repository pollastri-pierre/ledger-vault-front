// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Operation } from "data/types";
import queryString from "query-string";

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

const uri = ({
  keywords,
  accounts,
  currencyName,
  status,
  dateStart,
  dateEnd,
  minAmount,
  maxAmount
}: In) => {
  const query = {};
  if (keywords) query.label = keywords;
  if (minAmount) query.min_amount = minAmount;
  if (maxAmount) query.max_amount = maxAmount;
  // if (accountId) query.account = accountId;
  if (accounts) query.account = accounts;
  if (status) query.status = status;
  if (currencyName) query.currency = currencyName;
  if (dateStart) query.start = dateStart.toISOString();
  if (dateEnd) query.end = dateEnd.toISOString();
  query.with_daemon_info = true;
  const q = queryString.stringify(query);
  return `/operations${q ? "?" : ""}${q}`;
};

// Search operations
// This API is paginated, refer to ConnectionQuery documentation
export default class SearchQuery extends ConnectionQuery<In, Node> {
  uri = uri(this.props);

  nodeSchema = schema.Operation;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
