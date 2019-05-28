// @flow

import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { User } from "data/types";
import { success } from "formatters/notification";

type Input = {
  id: number,
};

type Response = User;

export default class SuspendUserMutation extends Mutation<Input, Response> {
  uri = `/people/${this.props.id}/suspend`;

  method = "POST";

  responseSchema = schema.User;

  getSuccessNotification = () => {
    return success("user", "suspended");
  };

  getBody() {
    return null;
  }
}
