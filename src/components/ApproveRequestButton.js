// @flow

import React, { PureComponent } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";

import Absolute from "components/base/Absolute";
import DeviceInteraction from "components/DeviceInteraction";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import { ModalFooterButton, ConfirmModal } from "components/base/Modal";

import colors from "shared/colors";
import type { GateError } from "data/types";
import type {
  Interaction,
  DeviceInteractionError,
} from "components/DeviceInteraction";
import type { DeviceError } from "utils/errors";

type Props = {
  interactions: Interaction[],
  isRevoke?: boolean,
  Icon?: React$ComponentType<*>,
  color?: string,
  additionalFields: Object,
  onSuccess: Function,
  onError?: (DeviceInteractionError, Object) => void,
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
  error: ?DeviceInteractionError,
};

class ApproveRequestButton extends PureComponent<Props, State> {
  state = {
    isInProgress: false,
    isConfirmModalOpened: false,
    error: null,
  };

  static defaultProps = {
    color: colors.ocean,
  };

  onCreate = () => {
    this.setState({ isInProgress: true, isConfirmModalOpened: false });
  };

  onError = (err: Error | GateError | DeviceError, responses: Object) => {
    const { onError } = this.props;
    this.setState({ isInProgress: false, error: err });
    onError && onError(err, responses);
  };

  openConfirmModal = () => this.setState({ isConfirmModalOpened: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpened: false });

  render() {
    const { isInProgress, isConfirmModalOpened, error } = this.state;
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
      <>
        {error && <TriggerErrorNotification error={error} />}
        {isInProgress ? (
          <Absolute right={15} bottom={15}>
            <DeviceInteraction
              light
              interactions={interactions}
              noCheckVersion
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
      </>
    );
  }
}

export default ApproveRequestButton;
