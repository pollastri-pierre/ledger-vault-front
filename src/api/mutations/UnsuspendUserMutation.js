// @flow

import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { User } from "data/types";

type Input = {
  id: number,
};

type Response = User;

export default class UnsuspendUserMutation extends Mutation<Input, Response> {
  uri = `/people/${this.props.id}/unsuspend`;

  method = "POST";

  responseSchema = schema.User;

  getSuccessNotification = () => ({
    title: "Success",
    content: "Workspace access has been granted.",
  });

  getBody() {
    return null;
  }
}
