// @flow
import queryString from "query-string";

// import ConnectionQuery from "restlay/ConnectionQuery";
import Query from "restlay/Query";
import schema from "data/schema";
import type { Group } from "data/types";

type Input = {
  name?: string
};

// type Node = Group;
type Response = Group[];

const uri = (query: Input) => {
  const finalQuery: Object = {
    ...query
  };
  const q = queryString.stringify(finalQuery);
  return `/groups${q ? "?" : ""}${q}`;
};

// Fetch all groups
export default class GroupsQuery extends Query<Input, Response> {
  uri = uri(this.props);

  // nodeSchema = schema.Group;
  responseSchema = [schema.Group];
}
