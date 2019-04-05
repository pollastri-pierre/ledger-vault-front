// @flow

import { BigNumber } from "bignumber.js";

import type { Account } from "data/types";

// flow don't even understand it was not an exact account.
export function deserializeAccount(account: Account): Account {
  return {
    ...account,
    balance: BigNumber(account.balance),
  };
}
