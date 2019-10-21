// @flow

type Generic = {
  name: string,
  description: string,
};
type CommonFields = $Exact<Generic>;

export const onlyDescriptionChangedGeneric = <
  T: Generic,
  S: $Keys<$Diff<T, CommonFields>>,
>(
  payload: T,
  initialPayload: T,
  field: S,
) => {
  return (
    !hasListChanged(payload, initialPayload, field) &&
    payload.name === initialPayload.name &&
    payload.description !== initialPayload.description
  );
};

export const hasEditOccuredGeneric = <
  T: Generic,
  S: $Keys<$Diff<T, CommonFields>>,
>(
  payload: T,
  initialPayload: T,
  field: S,
) => {
  return (
    hasListChanged(payload, initialPayload, field) ||
    payload.name !== initialPayload.name ||
    payload.description !== initialPayload.description
  );
};
const hasListChanged = <T: Generic, S: $Keys<$Diff<T, CommonFields>>>(
  payload: T,
  initialPayload: T,
  field: S,
) => {
  if (payload[field].length !== initialPayload[field].length) return true;
  return (
    initialPayload[field].filter(item =>
      payload[field].find(m => m.id === item.id),
    ).length !== initialPayload[field].length
  );
};
