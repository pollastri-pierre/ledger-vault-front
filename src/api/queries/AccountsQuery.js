// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";
import { deserializeAccount } from "api/transformations/Account";

type Input = void;
type Node = Account;

// Fetch all accounts
export default class AccountsQuery extends ConnectionQuery<Input, Node> {
  uri = "/accounts?status=ACTIVE&status=VIEW_ONLY&status=MIGRATED";

  responseSchema = schema.Account;

  filter = isSupportedAccount;

  deserialize = deserializeAccount;
}
