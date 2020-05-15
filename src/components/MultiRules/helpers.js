// @flow

import sortBy from "lodash/sortBy";
import { BigNumber } from "bignumber.js";

import type {
  User,
  Group,
  GovernanceRulesInEditData,
  AccountEditUsers,
  AccountEditGroup,
} from "data/types";

import type {
  RulesSet,
  RuleType,
  RuleMultiAuth,
  RuleThreshold,
  RuleMultiAuthStep,
  RuleWhitelist,
  GovernanceRules,
  RuleThresholdCondition,
  Rule,
} from "./types";

export const isRuleOfType = (rule: Rule, type: RuleType) => rule.type === type;

export const hasRuleOfType = (set: RulesSet, type: RuleType) =>
  set.rules.some((rule) => isRuleOfType(rule, type));

export const hasThresholdRule = (set: RulesSet) =>
  hasRuleOfType(set, "THRESHOLD");

export const hasWhitelistRule = (set: RulesSet) =>
  hasRuleOfType(set, "WHITELIST");

const getRuleOfType = <T>(set: RulesSet, type: RuleType): ?T => {
  // $FlowFixMe
  const r: ?T = set.rules.find((rule) => isRuleOfType(rule, type));
  return r || null;
};

export const getMultiAuthRule = (set: RulesSet): ?RuleMultiAuth =>
  getRuleOfType<RuleMultiAuth>(set, "MULTI_AUTHORIZATIONS");

export const getThresholdRule = (set: RulesSet): ?RuleThreshold =>
  getRuleOfType<RuleThreshold>(set, "THRESHOLD");

export const getWhitelistRule = (set: RulesSet): ?RuleWhitelist =>
  getRuleOfType<RuleWhitelist>(set, "WHITELIST");

// https://ledgerhq.atlassian.net/browse/LV-2218
export const isMaxOutRuleBroken = (rules: RuleMultiAuth) => {
  // if only 1 step or if step 1 contains internal group it respects the rule
  if (!rules.data[0] || rules.data[0].group.is_internal) return false;

  let i = 1;
  let isBroken = false;
  while (i < rules.data.length && isBroken === false) {
    const current = rules.data[i];
    if (current) {
      isBroken = isRuleBreakingMaxOutQuorumRule(current, rules);
    }
    i++;
  }
  return isBroken;
};

export const getMaxQuorum = (
  rule: RuleMultiAuthStep,
  rules: RuleMultiAuth,
): ?number => {
  if (!rules.data || !rules.data[0] || !rules.data.length === 0) return;
  if (rules.data[0].group.is_internal) return;

  const groupCreatorId = rules.data[0].group.id;
  const quorumCreator = rules.data[0].quorum;
  const maxQuorum = rule.group.members.length - quorumCreator;
  if (groupCreatorId === rule.group.id) {
    return maxQuorum;
  }
};

export const isRuleBreakingMaxOutQuorumRule = (
  rule: RuleMultiAuthStep,
  rules: RuleMultiAuth,
) => {
  if (
    !rules.data[0] ||
    rules.data[0].group.is_internal ||
    rules.data[0].group.members.length === 0
  ) {
    return false;
  }
  const maxQuorum = getMaxQuorum(rule, rules);
  if (!!maxQuorum && rule.quorum > maxQuorum) {
    return true;
  }
  return false;
};

export function getRulesSetErrors(set: RulesSet): Error[] {
  const errors = [];
  const multiAuthRule = getMultiAuthRule(set);
  if (multiAuthRule && isMaxOutRuleBroken(multiAuthRule)) {
    errors.push(new Error("MAX OUT QUORUM"));
  }
  if (!multiAuthRule || multiAuthRule.data.length === 0) {
    errors.push(new Error("No MULTI_AUTHORIZATION rule"));
  } else {
    // eslint-disable-next-line no-lonely-if
    if (multiAuthRule.data.length === 0) {
      errors.push(new Error("No step defined in MULTI_AUTHORIZATIONS rule"));
    }
    if (
      multiAuthRule.data.some((step) => step && step.group.members.length === 0)
    ) {
      errors.push(new Error("Some approval steps are invalid"));
    }
  }
  return errors;
}

export function isValidRulesSet(set: RulesSet): boolean {
  return getRulesSetErrors(set).length === 0;
}
export function isEmptyRulesSet(set: RulesSet): boolean {
  return set.rules.length === 1 && set.rules[0].data.length === 0;
}

export function getRulesSetHash(set: RulesSet) {
  const thresholdRule = getThresholdRule(set);
  const whitelistRule = getWhitelistRule(set);
  const multiAuthRule = getMultiAuthRule(set);
  return [
    thresholdRule
      ? [
          thresholdRule.data[0].min.toFixed(),
          thresholdRule.data[0].max
            ? thresholdRule.data[0].max.toFixed()
            : "nolimit",
        ].join("-")
      : "NO_THRESHOLD",
    whitelistRule
      ? sortBy(
          whitelistRule.data.map((w) => (typeof w === "number" ? w : w.id)),
        ).join("-")
      : "NO_WHITELIST",
    multiAuthRule
      ? multiAuthRule.data
          .map((step) => {
            if (!step) return "anon";
            const isInternal = step.group.is_internal === true;
            if (isInternal) {
              const members = sortBy(step.group.members.map((m) => m.id));
              return `${step.quorum}|[${members.join(",")}]`;
            }
            return `${step.quorum}|${step.group.id}`;
          })
          .join("-")
      : "NO_WHITELIST",
  ].join("__");
}

export function getDuplicateRulesSet(
  set: RulesSet,
  sets: RulesSet[],
): RulesSet | null {
  const hash = getRulesSetHash(set);
  return sets.find((s) => s !== set && hash === getRulesSetHash(s)) || null;
}

export function serializeRulesSetsForPOST(sets: RulesSet[]) {
  return sets.filter(isValidRulesSet).map<any>((set) => ({
    name: set.name,
    rules: set.rules.map((rule) => {
      if (rule.type === "MULTI_AUTHORIZATIONS") {
        return {
          type: rule.type,
          data: rule.data.map((step) =>
            step
              ? {
                  quorum: step.quorum,
                  ...(step.group.is_internal
                    ? { users: step.group.members.map((u) => u.id) }
                    : { group_id: step.group.id }),
                }
              : null,
          ),
        };
      }
      if (rule.type === "THRESHOLD") {
        return {
          type: rule.type,
          data: rule.data.map((threshold) => ({
            currency_type: "CRYPTO",
            min: threshold.min.toFixed(),
            max: threshold.max ? threshold.max.toFixed() : null,
          })),
        };
      }
      if (rule.type === "WHITELIST") {
        return {
          type: rule.type,
          data: rule.data.map((w) => {
            if (typeof w === "number") return w;
            return w.id;
          }),
        };
      }
      return rule;
    }),
  }));
}
/*
 * The API returns a weird format in edit_data.governances_rules,
 * and more particularly for MULTI_AUTHORIZATIONS rules
 * we need to convert { quorum: number, users: number } | { quorum: number, group_id: number}
 * to { quorum: number, group: Group }
 * see the tests in src/components/MultiRules/helpers.test.js for more details
 */
export function convertEditDataIntoRules(
  data: GovernanceRulesInEditData,
  users: User[],
  groups: Group[],
): GovernanceRules {
  return data.map((ruleSet) => {
    return {
      name: ruleSet.name,
      rules: ruleSet.rules.map((rule) => {
        return {
          type: rule.type,
          data:
            rule.type === "MULTI_AUTHORIZATIONS"
              ? rule.data.map((d) => {
                  return {
                    quorum: d.quorum,
                    group: extractGroupFromRule(d, users, groups),
                  };
                })
              : rule.type === "THRESHOLD"
              ? ([
                  {
                    ...rule.data[0],
                    min: BigNumber(rule.data[0].min),
                    max: BigNumber(rule.data[0].max),
                  },
                ]: RuleThresholdCondition[])
              : rule.type === "WHITELIST"
              ? rule.data
              : // $FlowFixMe
                null,
        };
      }),
    };
  });
}
export function extractGroupFromRule(
  data: AccountEditUsers | AccountEditGroup,
  users: User[],
  groups: Group[],
): $Shape<Group> {
  if (data.users && Array.isArray(data.users)) {
    const members = data.users
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean);
    return {
      is_internal: true,
      members,
    };
  }
  if (!data.users && data.group_id && typeof data.group_id === "number") {
    const group = groups.find((g) => g.id === data.group_id);
    if (!group) {
      throw new Error(`cannot find group with id: ${data.group_id}`);
    }
    return group;
  }
  throw new Error("invalid rule");
}
