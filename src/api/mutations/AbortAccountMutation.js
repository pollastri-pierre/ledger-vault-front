// @flow
import Mutation from "restlay/Mutation";
import type { Store } from "restlay/dataStore";
import { success, error } from "formatters/notification";

type Input = {
  accountId: number,
};

type Response = void; // FIXME what response?

export default class AbortAccountMutation extends Mutation<Input, Response> {
  method = "POST";

  uri = `/accounts/${this.props.accountId}/abort`;

  getSuccessNotification() {
    return success("account request", "aborted");
  }

  getErrorNotification(e: Error) {
    return error("account request", "aborted", e);
  }

  // FIXME this is just a PoC. it is yet unclear what the API should be. probably will need helpers.
  optimisticUpdater(store: Store): Store {
    const { entities } = store;
    const accounts = { ...entities.accounts };
    delete accounts[this.props.accountId];
    return { ...store, entities: { ...entities, accounts } };
  }
}
