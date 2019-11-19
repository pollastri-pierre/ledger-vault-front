// @flow

import type { BigNumber } from "bignumber.js";

import type { GovernanceRules, RulesSet } from "components/MultiRules/types";

import {
  getThresholdRule,
  getWhitelistRule,
} from "components/MultiRules/helpers";

type GetMatchingRulesSetInput = {|
  transaction: {|
    currency: string,
    amount: BigNumber,
    recipient: string,
  |},
  governanceRules: GovernanceRules,
|};

type GetMatchingRulesSetOutput = RulesSet | null;

/**
 * Returns the matching rules set when creating a transaction, or null
 * if nothing matches
 */
export function getMatchingRulesSet(
  input: GetMatchingRulesSetInput,
): GetMatchingRulesSetOutput {
  const { transaction, governanceRules } = input;
  const matchingRulesSet = governanceRules.find(rulesSet =>
    isMatchingRulesSet({ rulesSet, transaction }),
  );
  return matchingRulesSet || null;
}

function isMatchingRulesSet(input) {
  const { rulesSet } = input;
  const thresholdRule = getThresholdRule(rulesSet);
  const whitelistRule = getWhitelistRule(rulesSet);

  if (thresholdRule && !isThresholdMatching(thresholdRule, input)) {
    return false;
  }

  if (whitelistRule && !isWhitelistMatching(whitelistRule, input)) {
    return false;
  }

  return true;
}

function isThresholdMatching(thresholdRule, { transaction: { amount } }) {
  const [threshold] = thresholdRule.data;
  if (amount.isLessThan(threshold.min)) {
    return false;
  }
  if (threshold.max && amount.isGreaterThan(threshold.max)) {
    return false;
  }
  return true;
}

function isWhitelistMatching(
  whitelistRule,
  { transaction: { recipient, currency } },
) {
  return whitelistRule.data.some(whitelist => {
    if (typeof whitelist === "number") {
      console.warn("Received id of whitelist instead of whitelist");
      return false;
    }
    return whitelist.addresses.some(address => {
      return address.address === recipient && address.currency === currency;
    });
  });
}
