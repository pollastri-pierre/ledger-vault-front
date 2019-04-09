// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Transaction } from "data/types";
import queryString from "query-string";
import { deserializeTransaction } from "api/transformations/Transaction";

type In = {
  label?: string,
  currency?: string,
  status?: string[],
  accounts?: string[],
  start?: string,
  end?: string,
};

type Node = Transaction;

const uri = (query: In) => {
  const finalQuery: Object = {
    ...query,
    with_daemon_info: true,
  };
  const q = queryString.stringify(finalQuery);
  return `/transactions${q ? "?" : ""}${q}`;
};

export default class SearchQuery extends ConnectionQuery<In, Node> {
  uri = uri(this.props);

  nodeSchema = schema.Transaction;

  size = 30;

  deserialize = deserializeTransaction;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
