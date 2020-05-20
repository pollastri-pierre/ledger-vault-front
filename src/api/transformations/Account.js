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
  if (!("available_balance" in account)) {
    console.warn('No "available_balance" in account. Default to 0.');
    account.available_balance = 0;
  }
  if (account.available_balance === null) {
    console.warn("account.balance is null. Default to 0.");
    account.available_balance = 0;
  }
  if (account.governance_rules) {
    convertGovernanceRules(account.governance_rules);
  }

  if (
    account.last_request &&
    account.last_request.type === "EDIT_ACCOUNT" &&
    account.last_request.edit_data &&
    account.last_request.edit_data.governance_rules
  ) {
    convertGovernanceRules(account.last_request.edit_data.governance_rules);
  }

  //
  // Context:
  // - https://ledgerhq.atlassian.net/browse/LV-2096
  // - https://ledgerhq.atlassian.net/browse/LV-2103
  //
  // There is apparently some blocker on gate side to fill a pending account
  // with its governance rules, so let's fix the object here.
  //
  // Hope we can remove this some day.
  //
  if (account.status === "PENDING" || account.status === "PENDING_MIGRATED") {
    // $FlowFixMe (we don't want to pollute Account type with next_governance_rules)
    if (account.governance_rules === null && account.next_governance_rules) {
      account.governance_rules = account.next_governance_rules;
      account.next_governance_rules = null;
      convertGovernanceRules(account.governance_rules);
    }
  }

  return {
    ...account,
    balance: BigNumber(account.balance),
    available_balance: BigNumber(account.available_balance),
    parent_balance: account.parent_balance && BigNumber(account.parent_balance),
  };
}

export function convertGovernanceRules(governance_rules: any) {
  // convert thresholds to BigNumber
  governance_rules.forEach((rulesSet) => {
    const thresholdRule = getThresholdRule(rulesSet);
    if (thresholdRule) {
      const [threshold] = thresholdRule.data;
      threshold.min = BigNumber(threshold.min);
      threshold.max = threshold.max === null ? null : BigNumber(threshold.max);
    }
  });
}
