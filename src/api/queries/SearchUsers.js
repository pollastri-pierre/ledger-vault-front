// @flow

import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { User } from "data/types";

type Input = {
  name?: string,
  role?: string,
};

type Node = User;

const uri = (query: Input) => {
  let finalQuery = {};

  if (query && query.role) {
    finalQuery = {
      ...query,
    };
  } else {
    finalQuery = {
      ...query,
      role: ["ADMIN", "OPERATOR"],
    };
  }
  const q = queryString.stringify(finalQuery);
  return `/people${q ? "?" : ""}${q}`;
};

export default class SearchUsersQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  pageSize = 30;

  nodeSchema = schema.User;
}
