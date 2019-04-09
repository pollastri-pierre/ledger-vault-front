// @flow

import type { StepProps } from "components/base/MultiStepsFlow/types";

export type UserCreationPayload = {
  role: string,
  username: string,
  userID: string,
  request_id: ?string,
  url: ?string,
};

export type UserCreationUpdatePayload = ($Shape<UserCreationPayload>) => void;

export type UserCreationStepProps = StepProps<UserCreationPayload>;
