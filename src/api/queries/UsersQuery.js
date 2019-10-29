// @flow
import omit from "lodash/omit";
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
  // FIXME find a way in connectData to not forward all
  // propsToQueryParams to all requests wrapped in the same ConnectData
  const q = queryString.stringify(omit(finalQuery, "groupId"));
  return `/people${q ? "?" : ""}${q}`;
};

export default class UsersQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  pageSize = 30;

  nodeSchema = schema.User;
}
