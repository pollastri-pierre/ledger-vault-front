// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Whitelist } from "data/types";
import queryString from "query-string";

type In = {
  pageSize?: number,
};

type Node = Whitelist;

const uri = (query: In) => {
  const q = queryString.stringify(query);
  return `/whitelists${q ? "?" : ""}${q}`;
};

export default class WhitelistsQuery extends ConnectionQuery<In, Node> {
  uri = uri(this.props);

  nodeSchema = schema.Whitelist;

  pageSize = this.props.pageSize || 30;

  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (after !== undefined) params.cursor = after;
    return params;
  }
}
