// @flow

import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Operation } from "data/types";
import { success, error } from "formatters/notification";

import type { Note } from "./NewOperationMutation";

export type OperationToPOST = {
  amount: number,
  recipient: string,
  gas_price: number,
  gas_limit: number,
  note?: Note,
  operation_id: number,
};

export type Input = {
  operation: OperationToPOST,
  accountId: number,
};

type Response = Operation;

export default class NewEthereumOperationMutation extends Mutation<
  Input,
  Response,
> {
  uri = `/accounts/${this.props.accountId}/operations`;

  method = "POST";

  responseSchema = schema.Operation;

  getSuccessNotification() {
    return success("operation request", "created");
  }

  getErrorNotification(e: Error) {
    return error("operation request", "created", e);
  }

  getBody() {
    return this.props.operation;
  }
}
