// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  memberRole: string
};
type Response = Member[];

//  TODO needs an endpoint not paginated for this
//  when the endpoint exists, replace ConnectionQuery by simple Query
export default class MembersQuery extends ConnectionQuery<Input, Response> {
  uri = `/people?role=${this.props.memberRole}`;

  size = 30;

  responseSchema = schema.Member;
}
