// @flow

import { BigNumber } from "bignumber.js";

import { getThresholdRule } from "components/MultiRules/helpers";
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
  if (account.governance_rules) {
    // convert thresholds to BigNumber
    account.governance_rules.forEach(rulesSet => {
      const thresholdRule = getThresholdRule(rulesSet);
      if (thresholdRule) {
        const [threshold] = thresholdRule.data;
        threshold.min = BigNumber(threshold.min);
        threshold.max =
          threshold.max === null ? null : BigNumber(threshold.max);
      }
    });
  }

  return {
    ...account,
    balance: BigNumber(account.balance),
    parent_balance: account.parent_balance && BigNumber(account.parent_balance),
  };
}
