// @flow
import Mutation from "restlay/Mutation";
import { success } from "formatters/notification";

type Input = {
  requestId: number,
  signature: string,
  public_key: string,
};

type Response = Object; // TODO add Request type

export default class ApproveRequestMutation extends Mutation<Input, Response> {
  uri = `/requests/${this.props.requestId}/approve`;

  method = "POST";

  // responseSchema = schema.Member;

  getSuccessNotification = () => {
    return success("request", "updated");
  };

  getBody() {
    return {
      signature: this.props.signature,
      public_key: this.props.public_key,
    };
  }
}
