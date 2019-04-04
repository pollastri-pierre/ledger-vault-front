// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";
import { deserializeAccount } from "api/transformations/Account";

type Input = void;
type Response = Account[];

// Fetch all accounts
export default class AccountsQuery extends Query<Input, Response> {
  uri = "/accounts/status/APPROVED,VIEW_ONLY";

  responseSchema = [schema.Account];

  filter = isSupportedAccount;

  deserialize = deserializeAccount;
}
