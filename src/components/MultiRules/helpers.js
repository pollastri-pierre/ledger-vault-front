// @flow

import type {
  RulesSet,
  RuleType,
  RuleMultiAuth,
  RuleThreshold,
  RuleWhitelist,
  Rule,
} from "./types";

export const isRuleOfType = (rule: Rule, type: RuleType) => rule.type === type;

export const hasRuleOfType = (set: RulesSet, type: RuleType) =>
  set.rules.some(rule => isRuleOfType(rule, type));

export const hasThresholdRule = (set: RulesSet) =>
  hasRuleOfType(set, "THRESHOLD");

export const hasWhitelistRule = (set: RulesSet) =>
  hasRuleOfType(set, "WHITELIST");

const getRuleOfType = <T>(set: RulesSet, type: RuleType): ?T => {
  // $FlowFixMe
  const r: ?T = set.rules.find(rule => isRuleOfType(rule, type));
  return r || null;
};

export const getMultiAuthRule = (set: RulesSet): ?RuleMultiAuth =>
  getRuleOfType<RuleMultiAuth>(set, "MULTI_AUTHORIZATIONS");

export const getThresholdRule = (set: RulesSet): ?RuleThreshold =>
  getRuleOfType<RuleThreshold>(set, "THRESHOLD");

export const getWhitelistRule = (set: RulesSet): ?RuleWhitelist =>
  getRuleOfType<RuleWhitelist>(set, "WHITELIST");

export function getRulesSetErrors(set: RulesSet): Error[] {
  const errors = [];
  const multiAuthRule = getMultiAuthRule(set);
  if (!multiAuthRule) {
    errors.push(new Error("No MULTI_AUTHORIZATION rule"));
  } else {
    // eslint-disable-next-line no-lonely-if
    if (multiAuthRule.data.length === 0) {
      errors.push(new Error("No step defined in MULTI_AUTHORIZATIONS rule"));
    }
    if (multiAuthRule.data.some(step => step.group.members.length === 0)) {
      errors.push(new Error("Some approval steps are invalid"));
    }
  }
  return errors;
}

export function isValidRulesSet(set: RulesSet): boolean {
  return getRulesSetErrors(set).length === 0;
}

export function serializeRulesSetsForPOST(sets: RulesSet[]) {
  return sets.map<any>(set => ({
    name: set.name,
    rules: set.rules.map(rule => {
      if (rule.type === "MULTI_AUTHORIZATIONS") {
        return {
          type: rule.type,
          data: rule.data.map(step => ({
            quorum: step.quorum,
            ...(step.group.is_internal
              ? { users: step.group.members.map(u => u.id) }
              : { group_id: step.group.id }),
          })),
        };
      }
      if (rule.type === "THRESHOLD") {
        return {
          type: rule.type,
          data: rule.data.map(threshold => ({
            currency_type: "CRYPTO",
            min: threshold.min.toFixed(),
            max: threshold.max ? threshold.max.toFixed() : null,
          })),
        };
      }
      return rule;
    }),
  }));
}
