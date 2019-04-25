// @flow

export type ModalProps = {
  isOpened: boolean,
  children: React$Node,
  transparent?: boolean,
  onHide?: () => void,
  onClose?: () => void,
  disableBackdropClick?: boolean,
};
