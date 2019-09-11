// @flow
import Mutation from "restlay/Mutation";

type Input = {
  accountID: string,
};

type Response = *;

export default class AccountSyncMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/accounts/${this.props.accountID}/force_sync`;
}
