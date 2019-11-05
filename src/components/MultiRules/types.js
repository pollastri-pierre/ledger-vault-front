// @flow

import type { BigNumber } from "bignumber.js";
import type { Group } from "data/types";

export type RuleType = "MULTI_AUTHORIZATIONS" | "WHITELIST" | "THRESHOLD";

export type RulesSet = {|
  name: string,
  rules: Rule[],
|};

export type Rule = RuleMultiAuth | RuleWhitelist | RuleThreshold;

export type RuleMultiAuth = {|
  type: "MULTI_AUTHORIZATIONS",
  data: RuleMultiAuthStep[],
|};

export type RuleMultiAuthStep = {|
  quorum: number,
  group: $Shape<Group>,
|};

export type RuleWhitelist = {|
  type: "WHITELIST",
  data: number[],
|};

export type RuleThreshold = {|
  type: "THRESHOLD",
  data: RuleThresholdCondition[],
|};

export type RuleThresholdCondition = {|
  min: BigNumber,
  max: BigNumber | null,
|};
