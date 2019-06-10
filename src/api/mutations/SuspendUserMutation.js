// @flow

import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { User } from "data/types";

type Input = {
  id: number,
};

type Response = User;

export default class SuspendUserMutation extends Mutation<Input, Response> {
  uri = `/people/${this.props.id}/suspend`;

  method = "POST";

  responseSchema = schema.User;

  getSuccessNotification = () => ({
    title: "Success",
    content: "Workspace access has been suspended.",
  });

  getBody() {
    return null;
  }
}
