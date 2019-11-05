// @flow
import Mutation from "restlay/Mutation";
import type { ApproveFlowConfigOptions } from "components/DeviceInteraction";

type Input = {
  requestId: number,
  signature: string,
  public_key: string,
};

type Response = Object; // TODO add Request type

export default class ApproveRequestMutation extends Mutation<
  Input,
  Response,
  ApproveFlowConfigOptions,
> {
  uri = `/requests/${this.props.requestId}/approve`;

  method = "POST";

  // responseSchema = schema.Member;

  getBody() {
    return {
      signature: this.props.signature,
      public_key: this.props.public_key,
    };
  }
}
