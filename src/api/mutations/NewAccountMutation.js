// @flow
import Mutation from "restlay/Mutation";
import schema from "data/schema";
import type { Account } from "data/types";
import { success, error } from "formatters/notification";

type Input = {
  // TODO define the input types here
};

type Response = Account; // the account that has been created

export default class NewAccountMutation extends Mutation<Input, Response> {
  uri = "/accounts";

  method = "POST";

  responseSchema = schema.Member;

  getSuccessNotification() {
    return success("account request", "created");
  }

  getErrorNotification(e: Error) {
    return error("account request", "created", e);
  }

  getBody() {
    return this.props;
  }
}
