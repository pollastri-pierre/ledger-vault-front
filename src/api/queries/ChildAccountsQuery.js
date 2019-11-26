// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";
import { deserializeAccount } from "api/transformations/Account";

type Input = {
  parentAccountID: number,
};

type Node = Account;

const MAX = 2;

const uri = (query: Input) => {
  return `/accounts?parent=${query.parentAccountID}`;
};

export default class SearchAccountsQuery extends ConnectionQuery<Input, Node> {
  uri = uri(this.props);

  responseSchema = schema.Account;

  filter = isSupportedAccount;

  deserialize = deserializeAccount;

  pageSize = MAX;
}
