// @flow

import type { Address } from "data/types";
import type { StepProps } from "components/base/MultiStepsFlow/types";

export type WhitelistCreationPayload = {
  id?: number,
  name: string,
  description: string,
  addresses: Address[],
};

export type WhitelistCreationUpdatePayload = (
  $Shape<WhitelistCreationPayload>,
) => void;

type GenericStepProps = StepProps<WhitelistCreationPayload>;

export type WhitelistCreationStepProps = GenericStepProps & {};
