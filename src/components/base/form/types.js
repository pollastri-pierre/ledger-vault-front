// @flow

export type Hint = {
  key: string,
  label: React$Node | (string => React$Node),
  check: string => boolean,
  status?: "valid" | "invalid" | "unchecked",
};

export type InputProps<T> = {
  value: T,
  onChange: T => void | Promise<void>,
  errors?: Error[],
  warnings?: Error[],
  hints?: Hint[],
};

export type Icon = {
  size?: number,
  color?: string,
};

export type Alignment = "left" | "right" | "center";
