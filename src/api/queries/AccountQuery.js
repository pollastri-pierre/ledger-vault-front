// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Account } from "data/types";
import { deserializeAccount } from "api/transformations/Account";

type Input = {
  accountId: string,
};
type Response = Account;

// Fetch a specific account
export default class AccountQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}`;

  responseSchema = schema.Account;

  deserialize = deserializeAccount;
}
