// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { User } from "data/types";

type Input = void;
type Response = User;

// load myself! (Member model of the logged in user)
// it MUST returns 403 http code if user is not loggedin. that way we can reset the auth state on client.
export default class ProfileQuery extends Query<Input, Response> {
  uri = "/people/me";

  responseSchema = schema.Member;

  logoutUserIfStatusCode = 403;
}
