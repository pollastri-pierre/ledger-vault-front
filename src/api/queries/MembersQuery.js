// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  memberRole: string
};
type Response = Member[];

// fetch all organization members
export default class MembersQuery extends Query<Input, Response> {
  uri = `/people?role=${this.props.memberRole}`;

  responseSchema = [schema.Member];
}
