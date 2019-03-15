// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Account } from "data/types";

type Input = {
  groupId: string,
};
type Response = Account[];

// fetch all accounts where groups is used
export default class AccountsInGroupQuery extends Query<Input, Response> {
  uri = `/group-mock/${this.props.groupId}/accounts`;

  responseSchema = [schema.Account];
}
