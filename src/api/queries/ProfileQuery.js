//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Member } from "../../data/types";

type Input = void;
type Response = Member;

export default class ProfileQuery extends Query<Input, Response> {
  uri = "/organization/members/me";
  responseSchema = schema.Member;
  logoutUserIfStatusCode = 403;
}
