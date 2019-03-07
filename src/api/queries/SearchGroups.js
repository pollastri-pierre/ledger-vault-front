// @flow
import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Group } from "data/types";

type Input = {
  name?: string
};

type Node = Group;

const uri = (query: Input) => {
  const finalQuery: Object = {
    ...query
  };
  const q = queryString.stringify(finalQuery);
  return `/groups${q ? "?" : ""}${q}`;
};

// Fetch all groups
export default class GroupsQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  size = 30;

  nodeSchema = schema.Group;
}
