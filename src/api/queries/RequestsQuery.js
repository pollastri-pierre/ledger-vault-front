// @flow

import queryString from "query-string";

import Query from "restlay/Query";
import type { Request } from "data/types";

type Input = {
  status?: string | string[],
};
type Response = Request[];

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

export default class RequestsQuery extends Query<Input, Response> {
  uri = uri(this.props);

  size = 30;
}
