// @flow

export type ModalProps = {
  isOpened: boolean,
  children: React$Node,
  transparent?: boolean,
  onClose?: () => void,
  disableBackdropClick?: boolean,
};
