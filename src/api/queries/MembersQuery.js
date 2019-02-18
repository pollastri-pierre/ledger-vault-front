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
  uri = this.props.memberRole
    ? `/people-mocks/${this.props.memberRole}`
    : "/people";

  responseSchema = [schema.Member];

  cacheMaxAge = 60;
}
