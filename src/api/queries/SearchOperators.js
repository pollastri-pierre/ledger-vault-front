// @flow

import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  name?: string
};

type Node = Member;

const uri = (query: Input) => {
  const finalQuery: Object = {
    ...query,
    role: "OPERATOR"
  };
  const q = queryString.stringify(finalQuery);
  return `/people${q ? "?" : ""}${q}`;
};

export default class SearchOperatorsQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  size = 30;

  nodeSchema = schema.Member;
}
