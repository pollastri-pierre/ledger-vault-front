// @flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { User } from "data/types";

type Input = void;
type Response = User[];

// fetch all members that are approvers
export default class ApproversQuery extends Query<Input, Response> {
  uri = "/organization/approvers";

  responseSchema = [schema.Member];
}
