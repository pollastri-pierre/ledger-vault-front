// @flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Member } from "data/types";

type Input = {
  userRole: string
};
type Response = Member[];

const uri = (props: Input) => {
  const prefix = "/people";
  if (!props.userRole) {
    return prefix;
  }

  return `${prefix}?role=${props.userRole}`;
};

//  TODO needs an endpoint not paginated for this
//  when the endpoint exists, replace ConnectionQuery by simple Query
export default class UsersQuery extends ConnectionQuery<Input, Response> {
  uri = uri(this.props);

  size = 30;

  responseSchema = schema.Member;
}
