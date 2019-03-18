// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { User } from "data/types";

type Input = {
  userID: string,
};
type Response = User;

export default class UserQuery extends Query<Input, Response> {
  uri = `/people/${this.props.userID}`;

  responseSchema = schema.Member;
}
