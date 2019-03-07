// @flow
import Mutation from "restlay/Mutation";
// import schema from "data/schema";
import { success, error } from "formatters/notification";

type Input = {
  // TODO define the input types here
};

type Response = Object; // TODO add Request type

export default class NewRequestMutation extends Mutation<Input, Response> {
  uri = "/requests";

  method = "POST";

  // responseSchema = schema.Member;

  getSuccessNotification() {
    return success("request", "created");
  }

  getErrorNotification(e: Error) {
    return error("request", "created", e);
  }

  getBody() {
    return this.props;
  }
}
