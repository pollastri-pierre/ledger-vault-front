//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Account } from "../../datatypes";

type Input = void;
type Response = Account[];

export default class AccountsQuery extends Query<Input, Response> {
  uri = "/accounts";
  responseSchema = [schema.Account];
}
