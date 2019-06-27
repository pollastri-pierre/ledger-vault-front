// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import queryString from "query-string";

import type { User } from "data/types";

type Input = {
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

export default class UsersQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  pageSize = 30;

  nodeSchema = schema.User;
}
