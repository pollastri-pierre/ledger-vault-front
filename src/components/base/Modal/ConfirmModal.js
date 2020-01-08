// @flow

import React from "react";
import styled from "styled-components";

import ExclamationCircle from "components/icons/ExclamationCircle";
import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/base/Button";
import Modal from "./index";
import { ModalBody, ModalFooter } from "./components";
import type { ModalProps } from "./types";

type Props = ModalProps & {
  onConfirm: () => void,
  onReject: () => void,
  title: React$Node,
  confirmLabel: React$Node,
  rejectLabel: React$Node,
  isConfirmRed?: boolean,
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
    isConfirmRed,
  } = props;
  return (
    <Modal {...props} isOpened={isOpened} onClose={onReject}>
      <ModalBody width={450}>
        <WarningIconWrapper>
          <ExclamationCircle
            color={opacity(colors.light_orange, 0.6)}
            size={50}
          />
        </WarningIconWrapper>
        <Box flow={10} mt={20} align="center" justify="center">
          <Text fontWeight="bold">{title}</Text>
          {children}
        </Box>
        <ModalFooter>
          <Box grow flow={10} horizontal m={20} justify="space-between">
            <Button
              type="link"
              variant="info"
              data-test="Cancel"
              onClick={onReject}
            >
              {rejectLabel}
            </Button>
            <Button
              variant={isConfirmRed ? "danger" : "info"}
              type="filled"
              data-test="Confirm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </Box>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

const WarningIconWrapper = styled(Box)`
  align-self: center;
`;

ConfirmModal.defaultProps = {
  title: "Are you sure?",
  confirmLabel: "OK",
  rejectLabel: "Cancel",
};

export default ConfirmModal;
