// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  userRole: string
};
type Response = Member[];

// fetch all organization members
export default class MembersQuery extends Query<Input, Response> {
  // uri = this.props.userRole ? `/people/${this.props.userRole}`: "/people"
  uri = this.props.userRole
    ? `/people-mocks/${this.props.userRole}`
    : "/people";

  responseSchema = [schema.Member];

  cacheMaxAge = 60;
}
