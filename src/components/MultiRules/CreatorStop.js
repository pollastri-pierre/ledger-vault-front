// @flow

import React from "react";
import { FaArrowAltCircleRight, FaUserSecret } from "react-icons/fa";

import {
  ActionableStop,
  EditableStop,
  useReadOnly,
} from "components/base/Timeline";
import InfoBox from "components/base/InfoBox";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { User, Group } from "data/types";
import { StepMembers } from "./MultiAuthStop";
import SelectApprovals from "./SelectApprovals";
import Badge from "./Badge";
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
    onChange({ ...rule, data: [] });
  };

  if (
    creatorStep === undefined ||
    (creatorStep && !creatorStep.group.members.length)
  ) {
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
        isMandatory
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
  value: ?RuleMultiAuthStep,
  onChange: RuleMultiAuthStep => void,
};

const EditCreator = (props: EditProps) => {
  const { extraProps, value: step, onChange } = props;
  if (!extraProps) return null;
  if (!step) return null;
  const { rule, users, groups } = extraProps;
  return (
    <Box flow={20}>
      <SelectApprovals
        rule={rule}
        step={step}
        groups={groups}
        users={users}
        onChange={data => onChange({ ...data, quorum: 1 })} // enforce quorum to 1 for first step
        autoFocus={extraProps.shouldAutofocus}
      />
      {step.quorum > 1 && (
        <InfoBox type="warning">
          <Text i18nKey="approvalsRules:reset_quorum" />
        </InfoBox>
      )}
    </Box>
  );
};

const DisplayCreator = ({ value }: { value: ?RuleMultiAuthStep }) => {
  if (!value) {
    return (
      <Box horizontal flow={10}>
        <strong>Transaction creator:</strong>
        <FaUserSecret size={16} />
        <span>Anonymized</span>
      </Box>
    );
  }
  const isOldAccount = value.quorum > 1;
  return (
    <div style={{ lineHeight: 2.5 }}>
      <div>
        {isOldAccount ? (
          <>
            <Badge type="primary">{value.quorum} approvals</Badge> from:
          </>
        ) : (
          <strong>Transaction creator:</strong>
        )}
      </div>
      <StepMembers step={value} />
    </div>
  );
};

export default CreatorStop;
