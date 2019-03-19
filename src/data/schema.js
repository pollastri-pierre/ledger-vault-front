// @flow
import { create } from "restlay/SchemaDef";

// The schema defines how entities connect to each other in the API model

const User = create("users");
const Group = create("groups", {
  members: [User],
});

const Currency = create("currencies", {}, "name");
const Fiat = create("fiats");

const Account = create("accounts", {
  currency: Currency,
});

const Activity = create(
  "activities",
  {
    business_action: {
      author: User,
    },
  },
  "id",
);

const Operation = create(
  "operations",
  {
    notes: [
      {
        author: User,
      },
    ],
  },
  "id",
);

const Balance = create("balance");

export default {
  Group,
  User,
  Currency,
  Account,
  Operation,
  Fiat,
  Balance,
  Activity,
};
