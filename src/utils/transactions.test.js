// @flow

/* eslint-disable import/extensions */
// FIXME for no reason jest can't handle normal import, so forced
// to import like this:
import BigNumber from "bignumber.js/bignumber.js";
/* eslint-enable import/extensions */

import { isCreateTransactionEnabled } from "utils/transactions";

import { genUsers, genAccounts, genTransactions } from "data/mock-entities";

const users = genUsers(20);

test("should return false if accounts length is 0", () => {
  expect(isCreateTransactionEnabled([], [])).toBe(false);
});

test("should return false if there is 1 account with one pending", () => {
  const accounts = genAccounts(1, { users }, { status: "ACTIVE" });
  const transactions = genTransactions(1, { accounts, users });
  expect(isCreateTransactionEnabled(accounts, transactions)).toBe(false);
});

test("should return true if there is 1 account with no pending", () => {
  const accounts = genAccounts(1, { users }, { status: "ACTIVE" });
  expect(isCreateTransactionEnabled(accounts, [])).toBe(true);
});

test("should return true if there is 2 account with pending only in one account", () => {
  const accounts = genAccounts(2, { users }, { status: "ACTIVE" });
  const transactions = genTransactions(1, { accounts, users });
  expect(isCreateTransactionEnabled(accounts, transactions)).toBe(true);
});

test("should return false if there are 2 accounts with pendings", () => {
  const accounts = genAccounts(2, { users }, { status: "PENDING" });
  const transactions = genTransactions(2, { accounts, users });
  transactions[0].account_id = 1;
  transactions[1].account_id = 2;
  expect(isCreateTransactionEnabled(accounts, transactions)).toBe(false);
});

test("should return false if there are 2 accounts without funds", () => {
  const accounts = genAccounts(2, { users });
  accounts[0].balance = BigNumber(0);
  accounts[1].balance = BigNumber(0);
  expect(isCreateTransactionEnabled(accounts, [])).toBe(false);
});
