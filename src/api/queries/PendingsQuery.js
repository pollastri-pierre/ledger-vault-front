// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Transaction, Account } from "data/types";

type Input = void;
export type Response = {
  approveTransactions: Transaction[],
  watchTransactions: Transaction[],
  approveAccounts: Account[],
  watchAccounts: Account[],
};

// a mashup of everything we need for pending screen
export default class PendingsQuery extends Query<Input, Response> {
  uri = "/pendings";

  responseSchema = {
    approveTransactions: [schema.Transaction],
    watchTransactions: [schema.Transaction],
    approveAccounts: [schema.Account],
    watchAccounts: [schema.Account],
  };
}
