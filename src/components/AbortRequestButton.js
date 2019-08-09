// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { NetworkError } from "network";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import RequestsQuery from "api/queries/RequestsQuery";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import { ModalFooterButton } from "components/base/Modal";
import { FaStopCircle } from "react-icons/fa";
import colors from "shared/colors";

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
      await restlay.fetchQuery(
        new RequestsQuery({
          status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
          pageSize: -1,
        }),
      );
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
      <>
        {error && <TriggerErrorNotification error={error} />}
        <ModalFooterButton
          disabled={disabled}
          color={colors.grenade}
          onClick={this.abort}
        >
          <FaStopCircle style={{ marginRight: 10 }} />
          <Trans i18nKey="common:abort" />
        </ModalFooterButton>
      </>
    );
  }
}

export default connectData(AbortRequestButton);
