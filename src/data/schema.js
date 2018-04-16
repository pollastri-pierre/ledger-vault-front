//@flow
import { create } from "restlay/SchemaDef";

// The schema defines how entities connect to each other in the API model

const Member = create("members");

const Group = create("groups", {
    members: [Member]
});

const Currency = create("currencies", {}, "name");
const Fiat = create("fiats");

const Account = create("accounts", {
    currency: Currency
});

const Activity = create(
    "activities",
    {
        log: {
            author: Member
        }
    },
    "id"
);

const Operation = create(
    "operations",
    {
        notes: [
            {
                author: Member
            }
        ]
    },
    "id"
);

const Balance = create("balance");

export default {
    Group,
    Member,
    Currency,
    Account,
    Operation,
    Fiat,
    Balance,
    Activity
};
