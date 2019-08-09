// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Account } from "data/types";
import { deserializeAccount } from "api/transformations/Account";

type Input = {
  groupId: string,
};

type Node = Account;
// fetch all accounts where groups is used
export default class AccountsInGroupQuery extends ConnectionQuery<Input, Node> {
  uri = `/accounts?group=${this.props.groupId}&status=ACTIVE`;

  responseSchema = schema.Account;

  deserialize = deserializeAccount;
}
