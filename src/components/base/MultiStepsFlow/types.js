// @flow

export type MultiStepsFlowStep<T, P> = {
  id: string,
  name: React$Node,
  Step: React$ComponentType<StepProps<T> & P>,
  Cta?: React$ComponentType<{
    payload: T,
    onClose: Function,
    isEditMode?: boolean,
  }>,
  requirements?: T => boolean,
};

export type StepProps<T> = {
  payload: T,
  updatePayload: ($Shape<T>, ?() => void) => void,
  transitionTo: string => void,
  isEditMode?: boolean,
};
