//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Member } from "../../datatypes";

type Input = void;
type Response = Member[];

export default class MembersQuery extends Query<Input, Response> {
  uri = "/organization/members";
  responseSchema = [schema.Member];
}
