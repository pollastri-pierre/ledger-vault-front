import { isCreateOperationEnabled } from "utils/operations";

test("should return false if accounts length is 0", () => {
  expect(isCreateOperationEnabled([], [])).toBe(false);
});

test("should return false if there is 1 account with one pending", () => {
  const accounts = [{ id: 1, balance: 0, status: "APPROVED" }];
  const operations = [{ account_id: 1 }];
  expect(isCreateOperationEnabled(accounts, operations)).toBe(false);
});

test("should return true if there is 1 account with no pending", () => {
  const accounts = [{ id: 1, balance: 1, status: "APPROVED" }];
  const operations = [];
  expect(isCreateOperationEnabled(accounts, operations)).toBe(true);
});

test("should return true if there is 2 account with pending only in one account", () => {
  const accounts = [
    { id: 1, balance: 1, status: "APPROVED" },
    { id: 2, balance: 2, status: "APPROVED" }
  ];
  const operations = [{ account_id: 1 }];
  expect(isCreateOperationEnabled(accounts, operations)).toBe(true);
});

test("should return false if there are 2 accounts with pendings", () => {
  const accounts = [{ id: 1 }, { id: 2 }];
  const operations = [{ account_id: 1 }, { account_id: 2 }];
  expect(isCreateOperationEnabled(accounts, operations)).toBe(false);
});

test("should return false if there are 2 accounts without funds", () => {
  const accounts = [{ id: 1, balance: 0 }, { id: 2, balance: 0 }];
  const operations = [];
  expect(isCreateOperationEnabled(accounts, operations)).toBe(false);
});
