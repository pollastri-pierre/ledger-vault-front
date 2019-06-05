// @flow

import Query from "restlay/Query";
import schema from "data/schema";

type Input = {
  transactionID: string,
};

// TODO flowtype this
type Response = *;

export default class TransactionHistoryQuery extends Query<Input, Response> {
  uri = `/transactions/${this.props.transactionID}/history`;

  responseSchema = [schema.HistorySlice];
}
