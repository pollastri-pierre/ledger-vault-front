//@flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Member } from "data/types";
import { success, error } from "formatters/notification";

type Input = {
  first_name: string,
  last_name: string,
  email: string,
  picture: ?string
};

type Response = Member;

export default class SaveProfileMutation extends Mutation<Input, Response> {
  uri = "/organization/members/me";
  method = "PUT";
  responseSchema = schema.Member;

  getSuccessNotification() {
    return success("profile", "updated");
  }

  getErrorNotification(e: Error) {
    return error("profile", "updated", e);
  }

  getBody() {
    return this.props;
  }

  // TODO implement optimisticUpdater
}
