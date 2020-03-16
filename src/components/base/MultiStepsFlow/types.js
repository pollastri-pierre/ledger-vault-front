// @flow

export type MultiStepsFlowStep<T, P> = {|
  id: string,
  name: React$Node,
  Step: React$ComponentType<StepProps<T> & P>,
  Cta?: React$ComponentType<StepProps<T> & P>,
  onNext?: (T, PayloadUpdater<T>, ?P) => void | Promise<void>,
  nextLabel?: React$Node,
  WarningNext?: React$ComponentType<{ payload: T }>,
  requirements?: (T, ?P) => boolean,
  prevLabel?: React$Node,
  hideBack?: boolean,
  CustomFooterElementLeft?: React$ComponentType<StepProps<T> & P>,
  width?: number,
|};

export type PayloadUpdater<T> = ($Shape<T>, ?() => void) => void;

export type StepProps<T> = {
  payload: T,
  initialPayload: T,
  payloadToCompareTo: T,
  updatePayload: PayloadUpdater<T>,
  transitionTo: string => void,
  isEditMode?: boolean,
  onClose?: () => void,
  onSuccess?: () => void,
  onEnter: () => void,
};
