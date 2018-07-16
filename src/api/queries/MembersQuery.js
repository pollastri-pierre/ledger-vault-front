//@flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = void;
type Response = Member[];

// fetch all organization members
export default class MembersQuery extends Query<Input, Response> {
  uri = "/people";
  responseSchema = [schema.Member];
  cacheMaxAge = 60;
}
