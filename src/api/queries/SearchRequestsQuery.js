// @flow

import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";

type Input = {
  name?: string,
};

const uri = (query: Input) => {
  let finalQuery = {};

  finalQuery = {
    ...query,
  };

  const q = queryString.stringify(finalQuery);
  return `/requests${q ? "?" : ""}${q}`;
};

export default class SearchRequestsQuery extends ConnectionQuery<Input, *> {
  uri = uri(this.props);

  size = 30;
}
