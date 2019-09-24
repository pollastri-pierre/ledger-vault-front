// @flow

import React from "react";
import { FaExclamation } from "react-icons/fa";

import colors from "shared/colors";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Modal from "./index";
import { ModalTitle } from "./components";
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
      <Box width={450} p={40}>
        <ModalTitle bold align="center">
          {title}
        </ModalTitle>
        <Box flow={20} align="center" style={{ textAlign: "center" }}>
          <Box
            align="center"
            justify="center"
            bg={colors.pearl}
            width={40}
            height={40}
            borderRadius={50}
          >
            <FaExclamation color={colors.lead} />
          </Box>
          {children}
        </Box>
      </Box>
      <Box horizontal m={20} justify="space-between">
        <Button
          small
          type="outline"
          outlineColor={colors.pearl}
          data-test="Cancel"
          onClick={onReject}
        >
          {rejectLabel}
        </Button>
        <Button type="danger" small data-test="Confirm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Box>
    </Modal>
  );
}

ConfirmModal.defaultProps = {
  title: "Are you sure?",
  confirmLabel: "OK",
  rejectLabel: "Cancel",
};

export default ConfirmModal;
