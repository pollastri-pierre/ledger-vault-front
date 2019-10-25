// @flow
import Mutation from "restlay/Mutation";
import type { GenericRequest } from "data/types";

type Input = {
  requestID: string,
};

type Response = GenericRequest;

export default class AbortRequestMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests/${this.props.requestID}/abort`;

  getBody() {
    // temp body until it is removed from the gate
    return {};
  }
}
