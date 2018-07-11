//@flow
import Mutation from "restlay/Mutation";
import type { Account, Unit, Fiat } from "data/types";
import { success, error } from "formatters/notification";
import schema from "data/schema";

type In = { account: Account, currency_unit: Unit };

type Res = *;

export default class SaveAccountSettingsMutation extends Mutation<In, Res> {
  method = "PUT";
  uri = `/accounts/${this.props.account.id}/settings`;

  responseSchema = schema.Account;

  getSuccessNotification() {
    return success("account settings", "saved");
  }

  getErrorNotification(e: Error) {
    return error("account settings", "saved", e);
  }

  getBody() {
    const { account, ...rest } = this.props; //eslint-disable-line no-unused-vars
    return { ...rest };
  }
}
