// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Account } from "data/types";
import { isSupportedAccount } from "utils/accounts";

type Input = void;
export type Response = Account[];

export default class PendingAccountsQuery extends Query<Input, Response> {
  uri = "/accounts/pending";

  responseSchema = [schema.Account];

  filter = isSupportedAccount;
}
