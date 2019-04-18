// @flow

import Query from "restlay/Query";
import schema from "data/schema";

type Input = {
  accountID: string,
};

// TODO flowtype this
type Response = *;

export default class GroupHistoryQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountID}/history`;

  responseSchema = [schema.HistorySlice];
}
