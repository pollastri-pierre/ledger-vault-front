// @flow

import React from "react";
import { Trans } from "react-i18next";

import NumberChooser from "components/base/NumberChooser";
import InfoBox from "components/base/InfoBox";
import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { User, Group } from "data/types";
import SelectApprovals from "./SelectApprovals";
import type { RuleMultiAuthStep, RuleMultiAuth } from "./types";
import { isRuleBreakingMaxOutQuorumRule, getMaxQuorum } from "./helpers";

type Props = {
  rule: RuleMultiAuth,
  step: RuleMultiAuthStep,
  stepIndex: number,
  onChange: RuleMultiAuthStep => void,
  users: User[],
  groups: Group[],
};

const ApprovalStepParameters = (props: Props) => {
  const { rule, step, stepIndex, onChange, users, groups } = props;

  const handleChangeQuorum = quorum => onChange({ ...step, quorum });
  const maxQuorum = getMaxQuorum(step, rule);

  return (
    <Box flow={20}>
      <Text>1. Choose members or group</Text>
      <Box>
        <SelectApprovals
          rule={rule}
          step={step}
          stepIndex={stepIndex}
          groups={groups}
          users={users}
          onChange={onChange}
        />
        <NbOfUsers
          nb={step.group.members.length}
          isGroup={step.group.is_internal === false}
        />
      </Box>
      <Text>2. Number of required approvals:</Text>
      <Box align="center" pt={20}>
        <NumberChooser
          value={step.quorum}
          onChange={handleChangeQuorum}
          min={1}
          max={maxQuorum || step.group.members.length}
        />
      </Box>
      {!!maxQuorum && step.quorum >= maxQuorum && (
        <InfoBox type="info" withIcon>
          <Trans
            i18nKey="approvalsRules:cannot_maxout_quorum"
            count={maxQuorum}
            values={{ nb: maxQuorum }}
          />
        </InfoBox>
      )}
    </Box>
  );
};

const NbOfUsers = ({ nb, isGroup }: { nb: number, isGroup: boolean }) => (
  <Box style={{ alignSelf: "flex-end" }}>
    <Text size="small" color={colors.textLight}>
      <Trans
        i18nKey={
          isGroup
            ? "approvalsRules:approvalsFromNbGroup"
            : "approvalsRules:approvalsFromNb"
        }
        count={nb}
        values={{ nb }}
      />
    </Text>
  </Box>
);

export function isStepValid(step: ?RuleMultiAuthStep, rule: ?RuleMultiAuth) {
  if (!step) return false;
  if (!step.group.members.length) return false;

  return rule ? !isRuleBreakingMaxOutQuorumRule(step, rule) : true;
}

export default ApprovalStepParameters;
