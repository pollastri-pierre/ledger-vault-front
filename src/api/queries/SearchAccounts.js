// @flow
import queryString from "query-string";

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";

type Input = {
  name?: string
};

type Node = Account;

const uri = (query: Input) => {
  const finalQuery: Object = { ...query };
  const prefix = "/accounts-mock";
  const q = queryString.stringify(finalQuery);
  const suffix = q ? `?${q}` : "";
  return `${prefix}${suffix}`;
};

// Fetch all accounts
export default class AccountsQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  size = 30;

  nodeSchema = schema.Account;
}
