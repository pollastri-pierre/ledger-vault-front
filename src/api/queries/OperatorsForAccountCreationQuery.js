// @flow
import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { User } from "data/types";

type Input = {};

type Node = User;

const uri = () => {
  const finalQuery: Object = {
    status: "ACTIVE",
    role: ["OPERATOR"],
  };
  const q = queryString.stringify(finalQuery);
  return `/people${q ? "?" : ""}${q}`;
};

export default class OperatorsForAccountCreationQuery extends ConnectionQuery<
  Input,
  Node,
> {
  uri = uri();

  nodeSchema = schema.User;
}
