// @flow
import Mutation from "restlay/Mutation";
import type { Request } from "data/types";
import { success, error } from "formatters/notification";

type Input = {
  requestID: string,
};

type Response = Request;

export default class AbortRequestMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/requests/${this.props.requestID}/abort`;

  getSuccessNotification = () => {
    return success("request", "aborted");
  };

  getErrorNotification = (e: Error) => {
    return error("request", "aborted", e);
  };

  getBody() {
    // temp body until it is removed from the gate
    return {};
  }
}
