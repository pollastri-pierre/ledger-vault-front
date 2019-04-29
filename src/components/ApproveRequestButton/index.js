// @flow

import React, { PureComponent, Fragment } from "react";
import { NetworkError } from "network";
import { FaCheck, FaTrash } from "react-icons/fa";

import Absolute from "components/base/Absolute";
import DeviceInteraction from "components/DeviceInteraction";
import { ModalFooterButton, ConfirmModal } from "components/base/Modal";

import colors from "shared/colors";
import type { GateError } from "data/types";
import type { Interaction } from "components/DeviceInteraction";

type Props = {
  interactions: Interaction[],
  isRevoke?: boolean,
  Icon?: React$ComponentType<*>,
  color?: string,
  additionalFields: Object,
  onSuccess: Function,
  onError?: (Error | GateError | typeof NetworkError) => void,
  disabled?: boolean,
  buttonLabel: React$Node,

  // optional confirmation
  withConfirm?: boolean,
  confirmTitle?: React$Node,
  confirmContent?: React$Node,
  confirmLabel?: React$Node,
  rejectLabel?: React$Node,
};

type State = {
  isInProgress: boolean,
  isConfirmModalOpened: boolean,
};

class ApproveRequestButton extends PureComponent<Props, State> {
  state = {
    isInProgress: false,
    isConfirmModalOpened: false,
  };

  static defaultProps = {
    color: colors.ocean,
  };

  onCreate = () => {
    this.setState({ isInProgress: true, isConfirmModalOpened: false });
  };

  onError = (err: Error | GateError) => {
    const { onError } = this.props;
    this.setState({ isInProgress: false });
    onError && onError(err);
  };

  openConfirmModal = () => this.setState({ isConfirmModalOpened: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpened: false });

  render() {
    const { isInProgress, isConfirmModalOpened } = this.state;
    const {
      interactions,
      onSuccess,
      disabled,
      additionalFields,
      isRevoke,
      color,
      buttonLabel,
      withConfirm,
      confirmContent,
      confirmTitle,
      confirmLabel,
      rejectLabel,
      Icon,
    } = this.props;

    const BtnIcon = Icon || (isRevoke ? FaTrash : FaCheck);

    return (
      <Fragment>
        {isInProgress ? (
          <Absolute right={15} bottom={15}>
            <DeviceInteraction
              interactions={interactions}
              onSuccess={onSuccess}
              onError={this.onError}
              additionalFields={additionalFields}
            />
          </Absolute>
        ) : (
          <ModalFooterButton
            data-test="approve_button"
            color={color}
            onClick={withConfirm ? this.openConfirmModal : this.onCreate}
            isDisabled={disabled}
          >
            <BtnIcon style={{ marginRight: 10 }} />
            {buttonLabel}
          </ModalFooterButton>
        )}
        {withConfirm && confirmContent && (
          <ConfirmModal
            isOpened={isConfirmModalOpened}
            onConfirm={this.onCreate}
            onReject={this.closeConfirmModal}
            title={confirmTitle}
            confirmLabel={confirmLabel}
            rejectLabel={rejectLabel}
          >
            {confirmContent}
          </ConfirmModal>
        )}
      </Fragment>
    );
  }
}

export default ApproveRequestButton;
