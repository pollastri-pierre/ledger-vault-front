// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Group } from "data/types";

type Input = {
  groupId: string
};
type Response = Group;

// Fetch a specific group
export default class GroupQuery extends Query<Input, Response> {
  uri = `/group-mock/${this.props.groupId}`;

  responseSchema = schema.Group;
}
