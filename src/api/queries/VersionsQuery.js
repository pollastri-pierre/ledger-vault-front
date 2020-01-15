// @flow
import Query from "restlay/Query";

type Input = void;
type Response = *;

// Fetch all accounts
export default class VersionsQuery extends Query<Input, Response> {
  uri = "/_version";
}
