// @flow

export type InputProps<T> = {
  value: T,
  onChange: T => void,
  errors?: Error[],
  warnings?: Error[],
};
