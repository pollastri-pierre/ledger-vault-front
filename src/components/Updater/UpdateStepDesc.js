// @flow

import React from "react";

import type { VaultUpdatePlanStep } from "device/update/registry";

type Props = {
  step: VaultUpdatePlanStep,
};

const UpdateStepDesc = (props: Props) => {
  const { step } = props;
  const isOSUToFinal =
    step.type === "firm" &&
    step.transition.from.version === step.transition.to.version;

  return step.type === "firm" ? (
    <>
      Update firmware version from{" "}
      <strong>
        {step.transition.from.version}
        {isOSUToFinal ? "-OSU" : ""}{" "}
      </strong>
      <span />
      to <strong>{step.transition.to.version}</strong>
    </>
  ) : (
    <>
      Update Vault app version to <strong>{step.app.version}</strong>
    </>
  );
};

export default UpdateStepDesc;
