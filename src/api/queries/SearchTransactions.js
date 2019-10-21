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
  pageSize?: number,
  account?: string[],
  start?: string,
  end?: string,
};

type Node = Transaction;

const uri = (query: In) => {
  const q = queryString.stringify(query);
  return `/transactions${q ? "?" : ""}${q}`;
};

export default class SearchQuery extends ConnectionQuery<In, Node> {
  uri = uri(this.props);

  nodeSchema = schema.Transaction;

  pageSize = this.props.pageSize || 30;

  deserialize = deserializeTransaction;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
