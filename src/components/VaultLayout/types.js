// @flow

export type MenuItem = {
  key: string,
  label: React$Node,
  Icon: React$ComponentType<{}>,
  isActive?: boolean,
  isDisabled?: boolean,
  onClick?: () => void,
  url?: string,
  dataTest?: string,
  NotifComponent?: React$ComponentType<{}>,
};
