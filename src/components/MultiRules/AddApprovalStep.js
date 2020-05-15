// @flow

import React from "react";

import { ActionableStop } from "components/base/Timeline";
import type { User, Group } from "data/types";
import ApprovalStepParameters, { isStepValid } from "./ApprovalStepParameters";
import type { RuleMultiAuth, RuleMultiAuthStep } from "./types";

const emptyStep = {
  quorum: 1,
  group: { is_internal: true, members: [] },
};

type Props = {
  rule: RuleMultiAuth,
  onChange: (RuleMultiAuth) => void,
  isDisabled: boolean,
  users: User[],
  groups: Group[],
};

const AddApprovalStep = (props: Props) => {
  const { rule, onChange, isDisabled, users, groups } = props;

  const handleAdd = (step) => {
    // if no rule at all, we need to add a "creator" step
    if (rule.data.length === 0) {
      return onChange({ ...rule, data: [emptyStep, step] });
    }
    onChange({ ...rule, data: [...rule.data, step] });
  };

  const extraProps = {
    rule,
    users,
    groups,
    stepIndex: rule.data.length,
  };

  return (
    <ActionableStop
      label="Add approval step"
      desc="Users required to approve the transaction"
      extraProps={extraProps}
      isDisabled={isDisabled}
      EditComponent={EditApprovalStep}
      indentation={1}
      bulletSize="small"
      rope="inverted"
      bar="full"
      initialValue={emptyStep}
      isValid={isStepValid}
      onSubmit={handleAdd}
    />
  );
};

type ExtraProps = {
  rule: RuleMultiAuth,
  users: User[],
  groups: Group[],
  stepIndex: number,
};

export const EditApprovalStep = ({
  value,
  onChange,
  extraProps,
}: {
  extraProps?: ExtraProps,
  value: RuleMultiAuthStep | null,
  onChange: (RuleMultiAuthStep) => void,
}) => {
  if (!extraProps) return null;
  if (!value) return null;
  const { rule, users, groups, stepIndex } = extraProps;
  return (
    <ApprovalStepParameters
      rule={rule}
      step={value}
      stepIndex={stepIndex}
      onChange={onChange}
      users={users}
      groups={groups}
    />
  );
};

export default AddApprovalStep;
