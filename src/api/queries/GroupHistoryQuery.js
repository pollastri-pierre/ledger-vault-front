// @flow

import Query from "restlay/Query";
import schema from "data/schema";

type Input = {
  groupID: string,
};

// TODO flowtype this
type Response = *;

export default class GroupHistoryQuery extends Query<Input, Response> {
  uri = `/groups/${this.props.groupID}/history`;

  responseSchema = [schema.HistorySlice];
}
