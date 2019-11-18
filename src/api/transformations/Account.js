// @flow

import { BigNumber } from "bignumber.js";

import type { Account } from "data/types";

// flow don't even understand it was not an exact account.
export function deserializeAccount(account: Account): Account {
  if (!("balance" in account)) {
    console.warn('No "balance" in account. Default to 0.');
    account.balance = 0;
  }
  if (account.balance === null) {
    console.warn("account.balance is null. Default to 0.");
    account.balance = 0;
  }
  if (!("governance_rules" in account)) {
    console.warn(`account.governance_rules is not set. Defaulting to []`);
    account.governance_rules = [];
  }
  if (account.governance_rules === null) {
    console.warn(`account.governance_rules is null. Defaulting to []`);
    account.governance_rules = [];
  }
  return {
    ...account,
    balance: BigNumber(account.balance),
    parent_balance: account.parent_balance && BigNumber(account.parent_balance),
  };
}
