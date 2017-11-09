//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Member } from "../../datatypes";

type Input = void;
type Response = Member[];

export default class ApproversQuery extends Query<Input, Response> {
  uri = "/organization/approvers";
  responseSchema = [schema.Member];
}
