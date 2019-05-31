// @flow
import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Group } from "data/types";

type Input = {};

type Node = Group;

const uri = () => {
  const finalQuery: Object = {
    status: "ACTIVE",
  };
  const q = queryString.stringify(finalQuery);
  return `/groups${q ? "?" : ""}${q}`;
};

export default class GroupsForAccountCreationQuery extends ConnectionQuery<
  Input,
  Node,
> {
  uri = uri();

  nodeSchema = schema.Group;
}
