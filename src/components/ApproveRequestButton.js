// @flow

import React, { PureComponent } from "react";

import Absolute from "components/base/Absolute";
import Button from "components/base/Button";
import DeviceInteraction from "components/DeviceInteraction";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import { ConfirmModal } from "components/base/Modal";

import type { GateError } from "data/types";
import type {
  Interaction,
  DeviceInteractionError,
} from "components/DeviceInteraction";
import type { DeviceError } from "utils/errors";

type Props = {
  interactions: Interaction[],
  isRevoke?: boolean,
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
      buttonLabel,
      withConfirm,
      confirmContent,
      confirmTitle,
      confirmLabel,
      rejectLabel,
    } = this.props;

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
          <Button
            type={isRevoke ? "danger" : "primary"}
            disabled={disabled}
            data-test="approve_button"
            onClick={withConfirm ? this.openConfirmModal : this.onCreate}
          >
            {buttonLabel}
          </Button>
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
