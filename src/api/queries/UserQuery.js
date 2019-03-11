// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  userID: string
};
type Response = Member;

export default class UserQuery extends Query<Input, Response> {
  uri = `/people/${this.props.userID}`;

  responseSchema = schema.Member;
}
