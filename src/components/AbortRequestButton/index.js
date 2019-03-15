// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { NetworkError } from "network";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import DialogButton from "components/buttons/DialogButton";
import TriggerErrorNotification from "components/TriggerErrorNotification";

import type { GateError } from "data/types";

type Props = {
  requestID: string,
  restlay: RestlayEnvironment,
  onSuccess: () => void,
  onError: ?(Error | GateError | typeof NetworkError) => void,
  disabled?: boolean,
};

type State = {
  error: Error | GateError | typeof NetworkError | null,
};

class AbortRequestButton extends PureComponent<Props, State> {
  state = {
    error: null,
  };

  abort = async () => {
    const { requestID, restlay, onSuccess, onError } = this.props;

    try {
      await restlay.commitMutation(new AbortRequestMutation({ requestID }));
      onSuccess();
    } catch (error) {
      this.setState({ error });
      onError && onError(error);
    }
  };

  render() {
    const { disabled } = this.props;
    const { error } = this.state;

    return (
      <Fragment>
        {error && <TriggerErrorNotification error={error} />}
        <DialogButton disabled={disabled} abort onTouchTap={this.abort}>
          <Trans i18nKey="common:abort" />
        </DialogButton>
      </Fragment>
    );
  }
}

export default connectData(AbortRequestButton);
