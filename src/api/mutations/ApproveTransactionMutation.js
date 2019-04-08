// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Transaction } from "data/types";
import { success, error } from "formatters/notification";
import { deserializeTransaction } from "api/transformations/Transaction";

type In = {
  operationId: string,
  approval: string,
  public_key: string,
};

type Res = Transaction;

export default class ApproveTransactionMutation extends Mutation<In, Res> {
  uri = `/transactions/${this.props.operationId}/approve`;

  method = "POST";

  responseSchema = schema.Transaction;

  deserialize = deserializeTransaction;

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
