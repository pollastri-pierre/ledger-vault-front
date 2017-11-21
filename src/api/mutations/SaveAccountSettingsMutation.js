//@flow
import Mutation from "../../restlay/Mutation";
import type { Account, AccountSettings } from "../../data/types";
import { success, error } from "../../formatters/notification";

type In = {
  account: Account,
  name: string,
  settings: AccountSettings
};

type Res = Account;

export default class SaveAccountSettingsMutation extends Mutation<In, Res> {
  method = "POST";
  uri = `/accounts/${this.props.account.id}/settings`;

  getSuccessNotification() {
    return success("account settings", "saved");
  }

  getErrorNotification(e: Error) {
    return error("account settings", "saved", e);
  }

  getBody() {
    const { account: { id }, name, settings } = this.props;
    return { id, name, settings };
  }
}
