// @flow
import Mutation from "restlay/Mutation";
import type { Account } from "data/types";
import { success, error } from "formatters/notification";
import { deserializeAccount } from "api/transformations/Account";
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

  deserialize = deserializeAccount;

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
