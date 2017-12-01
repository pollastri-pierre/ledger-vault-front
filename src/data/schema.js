//@flow
import { create } from "../restlay/SchemaDef";

// The schema defines how entities connect to each other in the API model

const Member = create("members");

const Group = create("groups", {
  members: [Member]
});

const Currency = create("currencies", {}, "name");

const Account = create("accounts", {
  currency: Currency
});

const Operation = create(
  "operations",
  {
    notes: [
      {
        author: Member
      }
    ]
  },
  "uuid"
);

const Balance = create("balance");

export default {
  Group,
  Member,
  Currency,
  Account,
  Operation,
  Balance
};
