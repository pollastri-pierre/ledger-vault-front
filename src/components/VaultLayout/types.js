// @flow

export type MenuItem = {
  key: string,
  label: React$Node,
  Icon: React$ComponentType<{}>,
  isActive?: boolean,
  isDisabled?: boolean,
  onClick?: () => void,
  url?: string,
  query?: Object,
  dataTest?: string,
  NotifComponent?: React$ComponentType<{}>,
};
