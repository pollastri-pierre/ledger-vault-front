// @flow

import { BigNumber } from "bignumber.js";

import type { Account } from "data/types";

// flow don't even understand it was not an exact account.
export function deserializeAccount(account: Account): Account {
  if (!("balance" in account)) {
    console.warn('No "balance" in account. Default to 0.');
    account.balance = 0;
  }
  return {
    ...account,
    balance: BigNumber(account.balance),
    parent_balance: account.parent_balance && BigNumber(account.parent_balance),
  };
}
