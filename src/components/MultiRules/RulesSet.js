// @flow

import React from "react";
import { FaCheck, FaRegPaperPlane, FaArrowDown } from "react-icons/fa";

import Timeline, {
  TimelineStop,
  TimelineLabel,
} from "components/base/Timeline";
import Status from "components/Status";

import type { User, Group, Whitelist, CurrencyOrToken } from "data/types";
import AddApprovalStep from "./AddApprovalStep";
import ThresholdStop from "./ThresholdStop";
import WhitelistStop from "./WhitelistStop";
import MultiAuthStops from "./MultiAuthStops";
import CreatorStop from "./CreatorStop";

import {
  getMultiAuthRule,
  getThresholdRule,
  getWhitelistRule,
} from "./helpers";

import type {
  RulesSet as RulesSetType,
  RuleType,
  Rule,
  RuleThreshold,
  RuleWhitelist,
} from "./types";

const MAX_APPROVALS_STEPS = 4;

type Props = {|
  rulesSet: RulesSetType,
  onChange: RulesSetType => void,
  users: User[],
  groups: Group[],
  whitelists: Whitelist[],
  currencyOrToken: CurrencyOrToken,
  readOnly?: boolean,
|};

const RulesSet = (props: Props) => {
  const {
    rulesSet,
    onChange,
    users,
    whitelists,
    groups,
    currencyOrToken,
    readOnly,
  } = props;

  const thresholdRule = getThresholdRule(rulesSet);
  const whitelistRule = getWhitelistRule(rulesSet);
  const multiAuthRule = getMultiAuthRule(rulesSet);

  if (!multiAuthRule) {
    throw new Error("No MULTI_AUTHORIZATIONS rule on rules set");
  }

  const canAddApprovalStep = multiAuthRule.data.length < MAX_APPROVALS_STEPS;

  const onRemove = (type: RuleType) => () =>
    onChange({
      ...rulesSet,
      rules: rulesSet.rules.filter(r => r.type !== type),
    });

  // We assume there is only 1 rule of each type, so we can just replace
  // the only rule of the type to the new one.
  const replaceRule = (type: RuleType) => (newRule: Rule) =>
    onChange({
      ...rulesSet,
      rules: rulesSet.rules.map(rule => (rule.type === type ? newRule : rule)),
    });

  const onMultiAuthRuleChange = replaceRule("MULTI_AUTHORIZATIONS");

  const onAddRule = (rule: RuleThreshold | RuleWhitelist) =>
    onChange({ ...rulesSet, rules: [rule, ...rulesSet.rules] });

  const hasApprovalSteps = multiAuthRule.data.length > 1;

  return (
    <Timeline readOnly={readOnly}>
      <CreatorStop
        rule={multiAuthRule}
        onChange={onMultiAuthRuleChange}
        users={users}
        groups={groups}
      />

      {/* ---------- */}
      {/* CONDITIONS */}
      {/* ---------- */}
      {!readOnly && <TimelineLabel offset={5}>Conditions</TimelineLabel>}

      <ThresholdStop
        currencyOrToken={currencyOrToken}
        rule={thresholdRule}
        onRemove={onRemove("THRESHOLD")}
        onEdit={replaceRule("THRESHOLD")}
        onAdd={onAddRule}
      />

      <WhitelistStop
        rule={whitelistRule}
        onRemove={onRemove("WHITELIST")}
        onEdit={replaceRule("WHITELIST")}
        whitelists={whitelists}
        onAdd={onAddRule}
      />

      <TimelineStop
        Icon={FaArrowDown}
        bar="full"
        rope={!readOnly || hasApprovalSteps ? "normal" : undefined}
        pb={readOnly ? 0 : 15}
      >
        <div>
          <div>
            <strong>Request created</strong>
          </div>
          <div>
            Transaction status is <Status ml={3} status="PENDING" />
          </div>
        </div>
      </TimelineStop>

      {/* -------------- */}
      {/* APPROVAL STEPS */}
      {/* -------------- */}
      {!readOnly && <TimelineLabel offset={50}>Approval steps</TimelineLabel>}

      <MultiAuthStops
        rule={multiAuthRule}
        onChange={replaceRule("MULTI_AUTHORIZATIONS")}
        users={users}
        groups={groups}
      />

      <AddApprovalStep
        indentation={1}
        rule={multiAuthRule}
        onChange={onMultiAuthRuleChange}
        isDisabled={!canAddApprovalStep}
        users={users}
        groups={groups}
      />

      {/* ------------ */}
      {/* FINALIZATION */}
      {/* ------------ */}
      {!readOnly && <TimelineLabel offset={5}>Finalization</TimelineLabel>}

      {!readOnly ||
        (hasApprovalSteps && (
          <TimelineStop Icon={FaCheck} bar="full" bulletSize="small">
            <div>
              <div>
                <strong>All approvals collected</strong>
              </div>
              <div>
                Transaction status is <Status ml={3} status="APPROVED" />
              </div>
            </div>
          </TimelineStop>
        ))}

      <TimelineStop Icon={FaRegPaperPlane} bar="top" pt={readOnly ? 0 : 10}>
        <div>
          <div>
            <strong>Broadcasted to the blockchain</strong>
          </div>
          <div>
            Transaction status is <Status ml={3} status="SUBMITTED" />
          </div>
        </div>
      </TimelineStop>
    </Timeline>
  );
};

export default RulesSet;
