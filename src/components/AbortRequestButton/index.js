// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import DialogButton from "components/buttons/DialogButton";

type Props = {
  requestID: string,
  restlay: RestlayEnvironment,
  onSuccess: () => void,
  onError: Error => void
};

class AbortRequestButton extends PureComponent<Props> {
  abort = async () => {
    const { requestID, restlay, onSuccess, onError } = this.props;

    try {
      await restlay.commitMutation(new AbortRequestMutation({ requestID }));
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  render() {
    return (
      <DialogButton onTouchTap={this.abort}>
        <Trans i18nKey="common:abort" />
      </DialogButton>
    );
  }
}

export default connectData(AbortRequestButton);
