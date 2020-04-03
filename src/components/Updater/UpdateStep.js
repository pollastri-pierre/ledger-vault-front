// @flow

/* eslint-disable react/no-array-index-key */

import React from "react";
import { FaArrowRight, FaCheck, FaHourglassHalf } from "react-icons/fa";

import { TimelineStop } from "components/base/Timeline";
import type { VaultUpdatePlanStep } from "device/update/registry";
import type { VaultUpdatePlanStepStatus } from "./UpdatePlan";
import UpdateStepDesc from "./UpdateStepDesc";
import UpdateSubStep from "./UpdateSubStep";

type Props = {
  step: VaultUpdatePlanStep,
  error: ?Error,
  subject: rxjs$Subject<{ type: "click" }>,
  status: VaultUpdatePlanStepStatus,
};

const UpdateStep = (props: Props) => {
  const { step, status, subject, error } = props;

  const { isRunning, isDone } = status;
  const isWaiting = !isRunning && !isDone;
  const isFirm = step.type === "firm";
  const isApp = step.type === "app";

  return (
    <>
      <TimelineStop
        Icon={isRunning ? FaArrowRight : isDone ? FaCheck : FaHourglassHalf}
        bar="full"
        rope={isRunning && (isFirm || isApp) ? "normal" : undefined}
        bulletVariant={
          isWaiting ? "dashed" : isDone || isRunning ? "plain" : undefined
        }
      >
        <div>
          <UpdateStepDesc step={step} />
        </div>
      </TimelineStop>
      {isRunning &&
        status.substeps.map((substep, i) => (
          <UpdateSubStep
            key={i}
            status={status}
            substep={substep}
            index={i}
            subject={subject}
            error={error}
          />
        ))}
    </>
  );
};

export default UpdateStep;
