// @flow

import React from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import type { User, Group } from "data/types";
import { StepMembers } from "./MultiAuthStop";
import SelectApprovals from "./SelectApprovals";
import type { RuleMultiAuth, RuleMultiAuthStep } from "./types";

type Props = {
  rule: RuleMultiAuth,
  onChange: RuleMultiAuth => void,
  users: User[],
  groups: Group[],
};

const emptyStep = {
  quorum: 1,
  group: {
    is_internal: true,
    members: [],
  },
};

const CreatorStop = (props: Props) => {
  const { rule, users, groups, onChange } = props;
  const readOnly = useReadOnly();

  const stopProps = {
    bulletSize: "small",
    bar: "bot",
    pb: readOnly ? 0 : 20,
  };

  const creatorStep = rule.data[0];

  const extraProps = {
    rule,
    users,
    groups,
  };

  const handleSubmit = step => {
    const newRule = {
      ...rule,
      data: [...rule.data],
    };
    newRule.data[0] = step;
    onChange(newRule);
  };

  const handleRemove = () => {
    const newSteps = [...rule.data];
    newSteps.splice(0, 1, emptyStep);
    onChange({ ...rule, data: newSteps });
  };

  if (!creatorStep || !creatorStep.group.members.length) {
    return (
      <ActionableStop
        {...stopProps}
        isValid={() => true}
        label="Select creator"
        desc="Users allowed to create transactions and submit them for approval"
        extraProps={{ ...extraProps, shouldAutofocus: true }}
        initialValue={emptyStep}
        EditComponent={EditCreator}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <EditableStop
      {...stopProps}
      value={creatorStep}
      bulletVariant="plain"
      label="Select creator"
      isValid={() => true}
      Icon={FaArrowAltCircleRight}
      extraProps={extraProps}
      EditComponent={EditCreator}
      DisplayComponent={DisplayCreator}
      onSubmit={handleSubmit}
      onRemove={handleRemove}
    />
  );
};

type ExtraProps = {
  rule: RuleMultiAuth,
  users: User[],
  groups: Group[],
  shouldAutofocus?: boolean,
};

type EditProps = {
  extraProps?: ExtraProps,
  value: RuleMultiAuthStep,
  onChange: RuleMultiAuthStep => void,
};

const EditCreator = (props: EditProps) => {
  const { extraProps, value: step, onChange } = props;
  if (!extraProps) return null;
  const { rule, users, groups } = extraProps;
  return (
    <div>
      <SelectApprovals
        rule={rule}
        step={step}
        groups={groups}
        users={users}
        onChange={onChange}
        autoFocus={extraProps.shouldAutofocus}
      />
    </div>
  );
};

const DisplayCreator = ({ value }: { value: RuleMultiAuthStep }) => {
  return (
    <div style={{ lineHeight: 2.5 }}>
      <div>
        <strong>Transaction creator:</strong>
      </div>
      <StepMembers step={value} />
    </div>
  );
};

export default CreatorStop;
