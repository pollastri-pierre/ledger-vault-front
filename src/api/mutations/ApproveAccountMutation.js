// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Account } from "data/types";
import { success, error } from "formatters/notification";

type Input = {
  accountId: string,
  approval: string,
  public_key: string,
};

type Response = Account;

export default class ApproveAccountMutation extends Mutation<Input, Response> {
  uri = `/accounts/${this.props.accountId}/approve`;

  method = "POST";

  responseSchema = schema.Account;

  getSuccessNotification() {
    return success("account request", "approved");
  }

  getErrorNotification(e: Error) {
    return error("account request", "approved", e);
  }

  getBody() {
    const { public_key, approval } = this.props;
    return { pub_key: public_key, approval };
  }
}
