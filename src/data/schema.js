//@flow
import { schema } from "normalizr";

// The schema defines how entities connect to each other
// this define the front model schema, not exactly the one coming from the API (without the _id fields)

const Group = new schema.Entity("groups");

const Member = new schema.Entity("members", {
  groups: [Group]
});

/*
// FIXME some issues for now, need to figure this out later.
Group.define({
  members: [Member]
});
*/

const Currency = new schema.Entity(
  "currencies",
  {},
  {
    idAttribute: "name"
  }
);

const Account = new schema.Entity("accounts", { currency: Currency });

const Operation = new schema.Entity(
  "operations",
  {
    account: Account,
    currency: Currency,
    notes: [
      {
        author: Member
      }
    ]
  },
  {
    idAttribute: "uuid",
    processStrategy: ({ account_id, ...entity }) => ({
      ...entity,
      // NB this is to reconnect a disconnected model.
      // that means it will suppose account_id is already loaded.
      // we need to do smart loading system for that.
      // TODO i'm not sure if it's a good idea at all. schema better should reject the API because we can have runtime breaking cases ATM. ideally the API should yield the Account object in Operation
      account: account_id,
      currency: entity.currency_name
    })
  }
);

export default {
  Group,
  Member,
  Currency,
  Account,
  Operation
};
