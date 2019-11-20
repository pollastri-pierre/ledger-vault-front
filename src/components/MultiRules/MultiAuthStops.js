// @flow

// TODO: put back when we use real ids
/* eslint-disable react/no-array-index-key */

import React, { useState } from "react";
import { SortableContainer } from "react-sortable-hoc";
import arrayMove from "array-move";

import { Bar } from "components/base/Timeline";
import type { User, Group } from "data/types";
import MultiAuthStop from "./MultiAuthStop";
import type { RuleMultiAuth } from "./types";

type Props = {
  rule: RuleMultiAuth,
  onChange: RuleMultiAuth => void,
  users: User[],
  groups: Group[],
};

const MultiAuthStops = (props: Props) => {
  const { rule, onChange, users, groups } = props;
  const [editInProgress, setEditInProgress] = useState(false);

  // ignore the first step, because it is the creator step
  const steps = rule.data.slice(1);

  // no need to display drag handler if only 1 step
  // + hide all handlers when edit is in progress
  const hideHandler = editInProgress || steps.length === 1;

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newSteps = arrayMove(steps, oldIndex, newIndex);
    const creatorStep = rule.data[0];
    onChange({ ...rule, data: [creatorStep, ...newSteps] });
  };

  const handleRemove = step => () =>
    onChange({
      ...rule,
      data: rule.data.filter(s => s !== step),
    });

  const handleEdit = oldStep => newStep =>
    onChange({
      ...rule,
      data: rule.data.map(step => (step === oldStep ? newStep : step)),
    });

  const onStartEdit = () => setEditInProgress(true);
  const onStopEdit = () => setEditInProgress(false);

  return (
    <Container
      lockAxis="y"
      lockToContainerEdges
      lockOffset={10}
      useDragHandle
      onSortEnd={onSortEnd}
    >
      <Bar indentation={1} />
      {steps.map((step, i) => (
        <MultiAuthStop
          key={i}
          index={i}
          rule={rule}
          step={step}
          hideHandler={hideHandler}
          disableActions={editInProgress}
          onRemove={handleRemove(step)}
          onEdit={handleEdit(step)}
          users={users}
          groups={groups}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          isLast={i === steps.length - 1}
        />
      ))}
    </Container>
  );
};

const Container = SortableContainer(({ children }) => (
  <div style={{ position: "relative" }}>{children}</div>
));

export default MultiAuthStops;
