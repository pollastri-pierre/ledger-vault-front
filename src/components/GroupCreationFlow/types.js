// @flow

import type { Connection } from "restlay/ConnectionQuery";
import type { User } from "data/types";
import type { StepProps } from "components/base/MultiStepsFlow/types";

export type GroupCreationPayload = {
  id?: number,
  name: string,
  description: string,
  members: User[],
};

export type GroupCreationUpdatePayload = ($Shape<GroupCreationPayload>) => void;

type GenericStepProps = StepProps<GroupCreationPayload>;

export type GroupCreationStepProps = GenericStepProps & {
  operators: Connection<User>,
};
