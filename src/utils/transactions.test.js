// @flow

/* eslint-disable import/extensions */
// FIXME for no reason jest can't handle normal import, so forced
// to import like this:
import BigNumber from "bignumber.js/bignumber.js";
/* eslint-enable import/extensions */

import { isCreateTransactionEnabled } from "utils/transactions";

import { genUsers, genAccounts } from "data/mock-entities";

const users = genUsers(20);

test("should return false if accounts length is 0", () => {
  expect(isCreateTransactionEnabled([])).toBe(false);
});

test("should return true for an active account", () => {
  const accounts = genAccounts(1, { users }, { status: "ACTIVE" });
  expect(isCreateTransactionEnabled(accounts)).toBe(true);
});

test("should return false if there are 2 accounts without funds", () => {
  const accounts = genAccounts(2, { users });
  accounts[0].balance = BigNumber(0);
  accounts[1].balance = BigNumber(0);
  expect(isCreateTransactionEnabled(accounts)).toBe(false);
});

test("should return false if operator is not in first step of approval flow", () => {
  const accounts = genAccounts(1, { users }, { status: "ACTIVE" });
  accounts[0].governance_rules = [
    {
      name: "Rule 1",
      rules: [
        {
          type: "MULTI_AUTHORIZATIONS",
          data: [null, {}],
        },
      ],
    },
  ];
  expect(isCreateTransactionEnabled(accounts)).toBe(false);
});

test("should return true if operator is in first step of approval flow", () => {
  const accounts = genAccounts(1, { users }, { status: "ACTIVE" });
  accounts[0].governance_rules = [
    {
      name: "Rule 1",
      rules: [
        {
          type: "MULTI_AUTHORIZATIONS",
          data: [{}, null],
        },
      ],
    },
  ];
  expect(isCreateTransactionEnabled(accounts)).toBe(true);
});
