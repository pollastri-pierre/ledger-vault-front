// @flow

import React from "react";
import styled from "styled-components";
import {
  FaGripVertical,
  FaUserCheck,
  FaUser,
  FaUsers,
  FaUserSecret,
} from "react-icons/fa";
import { Trans } from "react-i18next";
import { SortableHandle, SortableElement } from "react-sortable-hoc";

import { EditableStop, useReadOnly } from "components/base/Timeline";
import Box from "components/base/Box";
import type { User, Group } from "data/types";
import { EditApprovalStep } from "./AddApprovalStep";
import { isStepValid } from "./ApprovalStepParameters";
import Badge from "./Badge";
import type { RuleMultiAuthStep, RuleMultiAuth } from "./types";

type Props = {|
  rule: RuleMultiAuth,
  step: RuleMultiAuthStep | null,
  hideHandler: boolean,
  disableActions: boolean,
  onRemove: () => void,
  onEdit: (RuleMultiAuthStep) => void,
  onStartEdit: () => void,
  onStopEdit: () => void,
  users: User[],
  groups: Group[],
  isLast: boolean,

  // used for drag & drop
  index: number, // eslint-disable-line react/no-unused-prop-types
|};

const UserIcon = (p) => (
  <FaUserCheck {...p} style={{ transform: "translateX(1px)" }} />
);

const MultiAuthStop = ({
  rule,
  step,
  hideHandler,
  disableActions,
  onRemove,
  onEdit,
  users,
  groups,
  onStartEdit,
  onStopEdit,
  isLast,
}: Props) => {
  const handleSubmit = (step) => {
    if (!step) return;
    onStopEdit();
    onEdit(step);
  };
  const readOnly = useReadOnly();
  return (
    <EditableStop
      rope={readOnly && isLast ? "inverted" : undefined}
      value={step}
      indentation={1}
      bulletSize="small"
      bulletVariant="plain"
      extraProps={{
        rule,
        users,
        groups,
        stepIndex: rule.data.indexOf(step),
        hideHandler: hideHandler || readOnly,
      }}
      label="Edit approval step"
      isValid={isStepValid}
      Icon={UserIcon}
      EditComponent={EditApprovalStep}
      DisplayComponent={DisplayApprovalStep}
      onStartEdit={onStartEdit}
      onCancelEdit={onStopEdit}
      onRemove={onRemove}
      onSubmit={handleSubmit}
      disableActions={disableActions}
    />
  );
};

type ExtraProps = {
  rule: RuleMultiAuth,
  users: User[],
  groups: Group[],
  hideHandler: boolean,
  stepIndex: number,
};

const DisplayApprovalStep = ({
  value,
  extraProps,
}: {
  value: RuleMultiAuthStep | null,
  extraProps?: ExtraProps,
}) => {
  if (!extraProps) return null;
  const { hideHandler } = extraProps;
  return (
    <div style={{ lineHeight: 2.5 }}>
      <Grip isVisible={!hideHandler} />
      {value ? (
        <>
          <Trans
            i18nKey="approvalsRules:approvalStepDesc"
            count={value.quorum}
            values={{ nb: value.quorum }}
            components={[<Badge type="primary" />]}
          />
          <span> </span>
          <StepMembers step={value} />
        </>
      ) : (
        <Box horizontal flow={10} align="center">
          <FaUserSecret size={16} />
          <span>Anonymized</span>
        </Box>
      )}
    </div>
  );
};

export const StepMembers = ({ step }: { step: RuleMultiAuthStep }) => (
  <>
    {step.group.is_internal ? (
      step.group.members.map((user) => (
        <Badge key={user.id} Icon={FaUser} style={{ marginRight: 5 }}>
          {user.username}
        </Badge>
      ))
    ) : (
      <Badge Icon={FaUsers}>{step.group.name}</Badge>
    )}
  </>
);

const Grip = SortableHandle(({ isVisible }: { isVisible: boolean }) => (
  <GripContainer tabIndex={0} isVisible={isVisible}>
    <FaGripVertical />
  </GripContainer>
));

const GripContainer = styled.div`
  position: absolute;
  left: -40px;
  top: 8px;
  padding: 20px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: ${(p) => (p.isVisible ? "auto" : "none")};
  opacity: ${(p) => (p.isVisible ? 0.5 : 0)};
  transform: translateX(${(p) => (p.isVisible ? 0 : 20)}px);
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }

  transition: 100ms ease-out;
  transition-property: opacity transform;
`;

const SortableMultiAuthStop: React$ComponentType<Props> = SortableElement(
  MultiAuthStop,
);

export default SortableMultiAuthStop;
