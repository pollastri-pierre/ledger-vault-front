//@flow
import Mutation from "../../restlay/Mutation";
import genericRenderNotif from "../../data/genericRenderNotif";
import type {
  Account,
  SecurityScheme,
  AccountSettings
} from "../../data/types";

type Input = {
  account: Account,
  name: string,
  security_scheme: SecurityScheme,
  settings: AccountSettings
};

type Response = Account;

export default class AbortAccountMutation extends Mutation<Input, Response> {
  method = "POST";
  notif = genericRenderNotif("account settings", "POST");
  uri = `/accounts/${this.props.account.id}/settings`;
  getBody() {
    const { account: { id }, name, security_scheme, settings } = this.props;
    return { id, name, security_scheme, settings };
  }
}
