//@flow
import Mutation from "restlay/Mutation";
import type { Account } from "data/types";
import { success, error } from "formatters/notification";
import schema from "data/schema";

type In = {
  account: Account,
  name: string
};

type Res = Account;

export default class EditAccountNameMutation extends Mutation<In, Res> {
  method = "PUT";
  uri = `/accounts/${this.props.account.id}`;

  responseSchema = schema.Account;

  getSuccessNotification() {
    return success("account'name", "saved");
  }

  getErrorNotification(e: Error) {
    return error("account's name", "saved", e);
  }

  getBody() {
    const {
      account: { id },
      name
    } = this.props;
    return { id, name };
  }
}
