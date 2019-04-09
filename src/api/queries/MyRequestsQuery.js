// @flow
import Query from "restlay/Query";
import schema from "data/schema";

type Input = *;
export type Response = *;

export default class MyRequestsQuery extends Query<Input, Response> {
  uri = `/requests/me`;

  responseSchema = [schema.Request];
}
