// @flow
import Mutation from "restlay/Mutation";
import { success } from "formatters/notification";

type Input = {
  requestId: number,
  approval: string,
  pubKey: string,
};

type Response = Object; // TODO add Request type

export default class ApproveRequestMutation extends Mutation<Input, Response> {
  uri = `/requests/${this.props.requestId}/approve`;

  method = "POST";

  // responseSchema = schema.Member;

  getSuccessNotification = () => {
    return success("request", "created");
  };

  getBody() {
    return {
      approval: this.props.approval,
      pub_key: this.props.pubKey,
    };
  }
}
