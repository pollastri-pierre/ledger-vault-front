// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Transaction, Account } from "data/types";

type Input = {
  transactionId: string,
};
type Response = {
  transaction: Transaction,
  account: Account,
};

// Fetch a single transaction and its associated account
export default class TransactionWithAccountQuery extends Query<
  Input,
  Response,
> {
  uri = `/transactions/${this.props.transactionId}/account`;

  responseSchema = {
    transaction: schema.Transaction,
    account: schema.Account,
  };
}
