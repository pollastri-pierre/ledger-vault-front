// @flow
import Mutation from "restlay/Mutation";
import { success } from "formatters/notification";

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

  getSuccessNotification = () => {
    return success("invite user", "updated");
  };

  getBody() {
    const { user_info } = this.props;
    return { username: user_info.username, user_id: user_info.user_id };
  }
}
