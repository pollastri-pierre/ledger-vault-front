// @flow

import React, { PureComponent, Fragment } from "react";
import DialogButton from "components/buttons/DialogButton";
import Box from "components/base/Box";
import DeviceInteraction from "components/DeviceInteraction";

import type { GateError } from "data/types";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
  action: Object => Promise<*>
};

type Props = {
  interactions: Interaction[],
  additionalFields: Object,
  onSuccess: Function,
  onError: (Error | GateError) => void,
  disabled: boolean,
  buttonLabel: React$Node
};

type State = {
  isInProgress: boolean
};

class ApproveRequestButton extends PureComponent<Props, State> {
  state = {
    isInProgress: false
  };

  onCreate = () => {
    this.setState({ isInProgress: true });
  };

  onError = (err: Error | GateError) => {
    const { onError } = this.props;
    this.setState({ isInProgress: false });
    onError(err);
  };

  render() {
    const { isInProgress } = this.state;
    const {
      interactions,
      onSuccess,
      disabled,
      additionalFields,
      buttonLabel
    } = this.props;
    return (
      <Fragment>
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
