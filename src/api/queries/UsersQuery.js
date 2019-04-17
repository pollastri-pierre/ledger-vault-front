// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import queryString from "query-string";

import type { User } from "data/types";

type Input = {
  role?: string,
};
type Response = User[];

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

//  TODO needs an endpoint not paginated for this
//  when the endpoint exists, replace ConnectionQuery by simple Query
export default class UsersQuery extends ConnectionQuery<Input, Response> {
  uri = uri(this.props);

  pageSize = 30;

  responseSchema = schema.User;
}
