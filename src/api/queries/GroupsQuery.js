// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Group } from "data/types";

type Input = void;
type Response = Group[];

// Fetch all groups
export default class GroupsQuery extends Query<Input, Response> {
  uri = "/groups-mocks";

  responseSchema = [schema.Group];
}
