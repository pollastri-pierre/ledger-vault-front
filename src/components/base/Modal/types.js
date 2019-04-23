// @flow

export type ModalProps = {
  isOpened: boolean,
  children: React$Node,
  onHide?: () => void,
  onClose?: () => void,
  disableBackdropClick?: boolean,
};
