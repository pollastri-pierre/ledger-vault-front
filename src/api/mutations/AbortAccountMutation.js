//@flow
import Mutation from "../../restlay/Mutation";
import genericRenderNotif from "../../data/genericRenderNotif";
import type { Store } from "../../restlay/dataStore";

type Input = {
  accountId: string
};

type Response = void; // FIXME what response?

export default class AbortAccountMutation extends Mutation<Input, Response> {
  method = "DELETE";
  notif = genericRenderNotif("account request", "DELETE");
  uri = `/accounts/${this.props.accountId}`;

  // FIXME this is just a PoC. it is yet unclear what the API should be. probably will need helpers.
  optimisticUpdater(store: Store): Store {
    const { entities } = store;
    const accounts = { ...entities.accounts };
    delete accounts[this.props.accountId];
    return { ...store, entities: { ...entities, accounts } };
  }
}
