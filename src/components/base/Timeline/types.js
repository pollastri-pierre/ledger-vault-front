// @flow

export type EditableComponent<T, P> = React$ComponentType<{
  value: T,
  onChange: T => void,
  extraProps?: P,
}>;

export type DisplayableComponent<T, P> = React$ComponentType<{
  value: T,
  extraProps?: P,
}>;
