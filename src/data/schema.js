//@flow
import { schema } from "normalizr";

// The schema defines how entities connect to each other in the API model

const Member = new schema.Entity("members");

const Group = new schema.Entity("groups", {
  members: [Member]
});

const Currency = new schema.Entity(
  "currencies",
  {},
  {
    idAttribute: "name"
  }
);

const Account = new schema.Entity("accounts", {
  currency: Currency
});

const Operation = new schema.Entity(
  "operations",
  {
    notes: [
      {
        author: Member
      }
    ]
  },
  {
    idAttribute: "uuid"
  }
);

const Balance = new schema.Entity("balance");

export default {
  Group,
  Member,
  Currency,
  Account,
  Operation,
  Balance
};
