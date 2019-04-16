// @flow

export type MultiStepsFlowStep<T, P> = {
  id: string,
  name: React$Node,
  Step: React$ComponentType<StepProps<T> & P>,
  Cta?: React$ComponentType<{
    payload: T,
    initialPayload: T,
    onClose: Function,
    transitionTo?: string => void,
    updatePayload?: PayloadUpdater<T>,
    isEditMode?: boolean,
  }>,
  requirements?: T => boolean,
  onNext?: (T, PayloadUpdater<T>, ?P) => Promise<void>,
  nextLabel?: React$Node,
  prevLabel?: React$Node,
};

export type PayloadUpdater<T> = ($Shape<T>, ?() => void) => void;

export type StepProps<T> = {
  payload: T,
  initialPayload: T,
  updatePayload: PayloadUpdater<T>,
  transitionTo: string => void,
  isEditMode?: boolean,
};
