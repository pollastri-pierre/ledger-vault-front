// @flow

import type { BigNumber } from "bignumber.js";
import type { Group, Whitelist } from "data/types";

export type RuleType = "MULTI_AUTHORIZATIONS" | "WHITELIST" | "THRESHOLD";

export type RulesSet = {|
  name: string,
  rules: Rule[],
|};

export type Rule = RuleMultiAuth | RuleWhitelist | RuleThreshold;

export type RuleMultiAuth = {|
  type: "MULTI_AUTHORIZATIONS",
  data: Array<RuleMultiAuthStep | null>,
|};

export type RuleMultiAuthStep = {|
  quorum: number,
  group: $Shape<Group>,
|};

export type RuleWhitelist = {|
  type: "WHITELIST",
  data: Array<number | Whitelist>,
|};

export type RuleThreshold = {|
  type: "THRESHOLD",
  data: RuleThresholdCondition[],
|};

export type RuleThresholdCondition = {|
  min: BigNumber,
  max: BigNumber | null,
|};
