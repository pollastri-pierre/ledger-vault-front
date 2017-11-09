//@flow
import Mutation from "../../restlay/Mutation";
import schema from "../../data/schema";
import genericRenderNotif from "../../data/genericRenderNotif";
import type { Account } from "../../datatypes";

type Input = {
  accountId: string
};

type Response = Account;

export default class ApproveAccountMutation extends Mutation<Input, Response> {
  uri = `/accounts/${this.props.accountId}`;
  method = "PUT";
  notif = genericRenderNotif("account request", "PUT");
  responseSchema = schema.Account;
  // TODO implement optimisticUpdater
}
