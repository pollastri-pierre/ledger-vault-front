//@flow
import Mutation from "restlay/Mutation";
import { success, error } from "formatters/notification";

type Input = {
  operationId: string
};

type Response = void; // FIXME what should it be?

export default class AbortOperationMutation extends Mutation<Input, Response> {
  uri = `/operations/${this.props.operationId}/abort`;
  method = "POST";

  getSuccessNotification() {
    return success("operation request", "aborted");
  }

  getErrorNotification(e: Error) {
    return error("operation request", "aborted", e);
  }
}
