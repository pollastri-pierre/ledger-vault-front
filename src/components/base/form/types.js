// @flow

export type Hint = {
  key: string,
  label: React$Node | (string => React$Node),
  check: string => boolean,
};

export type InputProps<T> = {
  value: T,
  onChange: T => void,
  errors?: Error[],
  warnings?: Error[],
  hints?: Hint[],
};
