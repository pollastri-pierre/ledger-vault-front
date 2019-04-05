// @flow
import Mutation from "restlay/Mutation";
import type { Account } from "data/types";
import { success, error } from "formatters/notification";
import schema from "data/schema";
import { deserializeAccount } from "api/transformations/Account";

// NOTE: currency_unit should be renamed to currency_unit_code. gate seem to expect a string which is not a unit
type In = { account: Account, currency_unit: string };

type Res = *;

export default class SaveAccountSettingsMutation extends Mutation<In, Res> {
  method = "PUT";

  uri = `/accounts/${this.props.account.id}/settings`;

  responseSchema = schema.Account;

  deserialize = deserializeAccount;

  getSuccessNotification() {
    return success("account settings", "saved");
  }

  getErrorNotification(e: Error) {
    return error("account settings", "saved", e);
  }

  getBody() {
    const { account, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return { ...rest };
  }
}
