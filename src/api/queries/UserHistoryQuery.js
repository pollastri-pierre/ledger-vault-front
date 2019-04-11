// @flow

import Query from "restlay/Query";
import schema from "data/schema";

type Input = {
  userID: string,
};

// TODO flowtype this
type Response = *;

export default class UserHistoryQuery extends Query<Input, Response> {
  uri = `/people/${this.props.userID}/history`;

  responseSchema = [schema.HistorySlice];
}
