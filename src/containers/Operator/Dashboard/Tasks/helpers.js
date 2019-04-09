import faker from "faker";
import moment from "moment";

import { genUsers, genAccounts } from "data/mock-entities";

const users = genUsers(20);
export const accounts = genAccounts(10, { users });
const accountIds = accounts.map(account => account.id);

export const mockTasks = [
  {
    status: "Awaiting approval",
    id: 1,
    approvals: [],
    expiration_date: moment().add(4, "d"),
    transaction: {
      account_id: faker.random.arrayElement(accountIds),
      price: {
        amount: 134999292,
      },
    },
  },
  {
    status: "Blocked",
    approvals: [],
    id: 2,
    expiration_date: moment().add(6, "d"),
    transaction: {
      account_id: faker.random.arrayElement(accountIds),
      price: {
        amount: 942999292,
      },
    },
  },
  {
    status: "Awaiting approval",
    approvals: [],
    id: 3,
    expiration_date: moment().add(1, "d"),
    transaction: {
      account_id: faker.random.arrayElement(accountIds),
      price: {
        amount: 584999292,
      },
    },
  },
];
