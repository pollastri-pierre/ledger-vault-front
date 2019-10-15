// @flow

import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";

type Input = {
  pageSize?: number,
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

  pageSize = this.props.pageSize || 30;
}
