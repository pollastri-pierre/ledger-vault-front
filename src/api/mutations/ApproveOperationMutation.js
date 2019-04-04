// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Operation } from "data/types";
import { success, error } from "formatters/notification";
import { deserializeOperation } from "api/transformations/Operation";

type In = {
  operationId: string,
  approval: string,
  public_key: string
};

type Res = Operation;

export default class ApproveOperationMutation extends Mutation<In, Res> {
  uri = `/operations/${this.props.operationId}/approve`;

  method = "POST";

  responseSchema = schema.Operation;

  deserialize = deserializeOperation;

  getSuccessNotification() {
    return success("operation request", "approved");
  }

  getErrorNotification(e: Error) {
    return error("operation request", "approved", e);
  }

  getBody() {
    const { public_key, approval } = this.props;
    return { pub_key: public_key, approval };
  }
}
