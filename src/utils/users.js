// @flow

import type { Account } from "data/types";

import { getMultiAuthRule } from "components/MultiRules/helpers";

// operators receive Null as a step if he is not part of it
// here, we check if inside *at least* one rule set we
// can access the first approval step
export const isMemberOfFirstApprovalStep = (account: Account) => {
  return (
    account.governance_rules &&
    account.governance_rules.some(rulesSet => {
      const multiAuthRule = getMultiAuthRule(rulesSet);
      if (!multiAuthRule) return false;
      const { data: rules } = multiAuthRule;
      if (!rules) return false;
      return !!rules[0];
    })
  );
};
