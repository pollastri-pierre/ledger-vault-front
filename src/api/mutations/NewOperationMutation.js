// @flow
import { BigNumber } from "bignumber.js";
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Operation } from "data/types";
import { success, error } from "formatters/notification";
import { deserializeOperation } from "api/transformations/Operation";

export type Note = {
  title: string,
  content: string
};

// FIXME API : The API is not consistent between GET operation and POST operation
export const speeds = {
  slow: "slow",
  medium: "normal",
  fast: "fast"
};

export type Speed = $Values<typeof speeds>;

export type OperationToPOST = {
  amount: BigNumber,
  fee_level: Speed,
  recipient: string,
  note?: Note,
  operation_id: number
};

export type Input = {
  operation: OperationToPOST,
  accountId: number
};

type Response = Operation; // the operation that has been created

export default class NewOperationMutation extends Mutation<Input, Response> {
  uri = `/accounts/${this.props.accountId}/operations`;

  method = "POST";

  responseSchema = schema.Operation;

  deserialize = deserializeOperation;

  getSuccessNotification() {
    return success("operation request", "created");
  }

  getErrorNotification(e: Error) {
    return error("operation request", "created", e);
  }

  getBody() {
    const { operation } = this.props;
    return {
      ...operation,
      amount: operation.amount.toFixed()
    };
  }
}
