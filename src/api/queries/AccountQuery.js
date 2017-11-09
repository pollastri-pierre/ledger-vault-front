//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Account } from "../../datatypes";

type Input = {
  accountId: string
};
type Response = Account;

export default class AccountQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}`;
  responseSchema = schema.Account;
}
