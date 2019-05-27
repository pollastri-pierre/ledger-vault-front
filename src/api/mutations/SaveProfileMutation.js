// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { User } from "data/types";
import { success } from "formatters/notification";

type Input = {
  first_name: string,
  last_name: string,
  email: string,
  picture: ?string,
};

type Response = User;

export default class SaveProfileMutation extends Mutation<Input, Response> {
  uri = "/organization/members/me";

  method = "PUT";

  responseSchema = schema.User;

  getSuccessNotification = () => {
    return success("profile", "updated");
  };

  getBody() {
    return this.props;
  }
}
