// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  memberId: string
};
type Response = Member;

// Fetch a specific group
export default class MemberQuery extends Query<Input, Response> {
  uri = `/member-mock/${this.props.memberId}`;

  responseSchema = schema.Member;
}
