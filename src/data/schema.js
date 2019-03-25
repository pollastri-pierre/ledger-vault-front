// @flow
import { create } from "restlay/SchemaDef";

// The schema defines how entities connect to each other in the API model

const User = create("users");
const Group = create("groups", {
  members: [User],
});

const Currency = create("currencies", {}, "name");
const Fiat = create("fiats");

const Account = create("accounts");

const Request = create("requests");

const HistorySlice = create(
  "HistorySlices",
  {},
  // FIXME we don't have any id
  "created_on",
);

const Activity = create(
  "activities",
  {
    business_action: {
      author: User,
    },
  },
  "id",
);

const Transaction = create(
  "transactions",
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
  Request,
  Currency,
  HistorySlice,
  Account,
  Transaction,
  Fiat,
  Balance,
  Activity,
};
