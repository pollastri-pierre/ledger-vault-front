// @flow

import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import type { GenericRequest } from "data/types";

type Input = {
  status?: string | string[],
};
type Node = GenericRequest;

const uri = (query: Input) => {
  let finalQuery = {};

  if (query && query.status) {
    finalQuery = {
      ...query,
      status: query.status,
    };
  } else {
    finalQuery = {
      ...query,
    };
  }
  const q = queryString.stringify(finalQuery);
  return `/requests${q ? "?" : ""}${q}`;
};

export default class RequestsQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  pageSize = 30;
}
