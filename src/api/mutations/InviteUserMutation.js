// @flow
import Mutation from "restlay/Mutation";
import { success } from "formatters/notification";

export const types = {
  admin: "CREATE_ADMIN",
  operator: "CREATE_OPERATOR",
};

export type Type = $Values<typeof types>;

type Input = {
  user: {
    type: Type,
    username: string,
    user_id: string,
  },
};

type Response = *;

export default class InviteUserMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests`;

  getSuccessNotification = () => {
    return success("User invitation", "created");
  };

  getBody() {
    return this.props.user;
  }
}
