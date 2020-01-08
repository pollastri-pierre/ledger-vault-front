// @flow
import Mutation from "restlay/Mutation";

type In = {
  request_id: string,
  user_info: {
    username?: string,
    user_id?: string,
  },
};

type Res = *;

export default class UpdateUserRegistrationMutation extends Mutation<In, Res> {
  method = "PUT";

  uri = `/requests/${this.props.request_id}`;

  getBody() {
    const { user_info } = this.props;
    return { username: user_info.username, user_id: user_info.user_id };
  }
}
