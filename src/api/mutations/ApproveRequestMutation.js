// @flow
import Mutation from "restlay/Mutation";
// import schema from "data/schema";
import { success, error } from "formatters/notification";

type Input = {
  requestId: number,
  approval: string
};

type Response = Object; // TODO add Request type

export default class ApproveRequestMutation extends Mutation<Input, Response> {
  uri = `/requests/${this.props.requestId}/approve`;

  method = "POST";

  // responseSchema = schema.Member;

  getSuccessNotification() {
    return success("request", "updated");
  }

  getErrorNotification(e: Error) {
    return error("request", "updated", e);
  }

  getBody() {
    return {
      approval: this.props.approval
    };
  }
}
