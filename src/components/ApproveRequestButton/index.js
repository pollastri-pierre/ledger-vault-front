// @flow

import React, { PureComponent, Fragment } from "react";
import { NetworkError } from "network";
import DialogButton from "components/buttons/DialogButton";
import Box from "components/base/Box";
import DeviceInteraction from "components/DeviceInteraction";
import TriggerErrorNotification from "components/TriggerErrorNotification";

import type { GateError } from "data/types";
import type { Interaction } from "components/DeviceInteraction";

type Props = {
  interactions: Interaction[],
  additionalFields: Object,
  onSuccess: Function,
  onError: ?(Error | GateError | typeof NetworkError) => void,
  disabled: boolean,
  buttonLabel: React$Node,
};

type State = {
  isInProgress: boolean,
  error: Error | GateError | typeof NetworkError | null,
};

class ApproveRequestButton extends PureComponent<Props, State> {
  state = {
    isInProgress: false,
    error: null,
  };

  onCreate = () => {
    this.setState({ isInProgress: true });
  };

  onError = (err: Error | GateError) => {
    const { onError } = this.props;
    this.setState({ isInProgress: false, error: err });
    onError && onError(err);
  };

  render() {
    const { isInProgress, error } = this.state;
    const {
      interactions,
      onSuccess,
      disabled,
      additionalFields,
      buttonLabel,
    } = this.props;
    return (
      <Fragment>
        {error && <TriggerErrorNotification error={error} />}
        {isInProgress ? (
          <Box mb={15}>
            <DeviceInteraction
              interactions={interactions}
              onSuccess={onSuccess}
              onError={this.onError}
              additionalFields={additionalFields}
            />
          </Box>
        ) : (
          <DialogButton
            highlight
            onTouchTap={this.onCreate}
            disabled={disabled}
          >
            {buttonLabel}
          </DialogButton>
        )}
      </Fragment>
    );
  }
}

export default ApproveRequestButton;
