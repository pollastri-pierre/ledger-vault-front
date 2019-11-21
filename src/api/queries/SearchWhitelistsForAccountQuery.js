// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Whitelist } from "data/types";
import queryString from "query-string";

type In = {
  pageSize?: number,
};

type Node = Whitelist;

const uri = () => {
  const finalQuery: Object = {
    status: "ACTIVE",
  };
  const q = queryString.stringify(finalQuery);
  return `/whitelists${q ? "?" : ""}${q}`;
};

export default class SearchWhitelistsForAccountQuery extends ConnectionQuery<
  In,
  Node,
> {
  uri = uri();

  nodeSchema = schema.Whitelist;
}
