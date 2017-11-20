//@flow
import Mutation from "../../restlay/Mutation";
import schema from "../../data/schema";
import type { Member } from "../../data/types";

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
  successNotification = {
    title: "Profile updated",
    content: "Your profile informations have been successfully updated"
  };
  errorNotification = {
    title: "Oops",
    content: "Something went wrong when updating your profile"
  };
  responseSchema = schema.Member;

  getBody() {
    return this.props;
  }

  // TODO implement optimisticUpdater
}
