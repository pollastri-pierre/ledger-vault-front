// @flow
import Mutation from "restlay/Mutation";

export const types = {
  admin: "CREATE_ADMIN",
  operator: "CREATE_OPERATOR"
};

export type Type = $Values<typeof types>;

type Input = {
  member: {
    type: Type,
    username: string,
    user_id: string
  }
};

type Response = *;

export default class InviteMemberQuery extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests`;

  getBody() {
    return this.props.member;
  }
}
