// @flow

import React from "react";

import colors from "shared/colors";
import Box from "components/base/Box";
import Modal from "./index";
import { ModalFooter, ModalTitle } from "./components";
import ModalFooterButton from "./ModalFooterButton";
import type { ModalProps } from "./types";

type Props = ModalProps & {
  onConfirm: () => void,
  onReject: () => void,
  title: React$Node,
  confirmLabel: React$Node,
  rejectLabel: React$Node,
};

function ConfirmModal(props: Props) {
  const {
    children,
    isOpened,
    title,
    confirmLabel,
    rejectLabel,
    onConfirm,
    onReject,
  } = props;
  return (
    <Modal {...props} isOpened={isOpened} onClose={onReject}>
      <Box width={450} p={40} mb={60}>
        <ModalTitle>{title}</ModalTitle>
        {children}
      </Box>
      <ModalFooter justify="space-between">
        <ModalFooterButton onClick={onReject}>{rejectLabel}</ModalFooterButton>
        <ModalFooterButton color={colors.ocean} onClick={onConfirm}>
          {confirmLabel}
        </ModalFooterButton>
      </ModalFooter>
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  title: "Are you sure?",
  confirmLabel: "OK",
  rejectLabel: "Cancel",
};

export default ConfirmModal;
