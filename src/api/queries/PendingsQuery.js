//@flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation, Account } from "data/types";

type Input = void;
export type Response = {
  approveOperations: Operation[],
  watchOperations: Operation[],
  approveAccounts: Account[],
  watchAccounts: Account[]
};

// a mashup of everything we need for pending screen
export default class PendingsQuery extends Query<Input, Response> {
  uri = "/pendings";
  responseSchema = {
    approveOperations: [schema.Operation],
    watchOperations: [schema.Operation],
    approveAccounts: [schema.Account],
    watchAccounts: [schema.Account]
  };
}
