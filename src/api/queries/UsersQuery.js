// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  userRole: string
};
type Response = Member[];

//  TODO needs an endpoint not paginated for this
//  when the endpoint exists, replace ConnectionQuery by simple Query
export default class UsersQuery extends ConnectionQuery<Input, Response> {
  uri = `/people?role=${this.props.userRole}`;

  size = 30;

  responseSchema = schema.Member;
}
